const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const cases=JSON.parse(fs.readFileSync(path.join(root,'docs','customer-cases.json'),'utf8'));
const caseIds=cases.map(({id})=>id);
const args=process.argv.slice(2);
const at=args.indexOf('--case');
const selected=at>=0 ? [args[at+1]] : caseIds;
if(selected.some(id=>!caseIds.includes(id))){console.error('Choose one of: '+caseIds.join(', ')+'.');process.exit(2);}
const missing=selected.filter(id=>!fs.existsSync(path.join(root,'tests/uat',id+'.spec.cjs')));
if(missing.length){
 console.error('NOT READY - no UAT test was run. Create and review these test files first: '+missing.join(', '));
 console.error('Follow the Observe -> Agree -> Generate -> Review steps. Run U01 alone while learning; the full suite expects all '+caseIds.length+' authored files.');process.exit(2);
}
let cli;
try{cli=path.join(path.dirname(require.resolve('@playwright/test/package.json')),'cli.js');}catch{console.error('SETUP INCOMPLETE: install dependencies with npm ci from the package root.');process.exit(2);}
const extra=at>=0 ? args.filter((_,i)=>i!==at&&i!==at+1) : args;
const child=spawn(process.execPath,[cli,'test','-c','playwright.uat.config.cjs',...selected.map(id=>id+'.spec.cjs'),...extra],{cwd:root,stdio:'inherit',env:process.env,windowsHide:true});
child.on('error',e=>{console.error(e.message);process.exitCode=2;});child.on('exit',code=>{process.exitCode=code??2;});
