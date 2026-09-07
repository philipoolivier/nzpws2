export const formatPartialAddress = addressText => {
  // get address parts from string...
  const lines = addressText.split(", ");

  // now add to array
  const addressLines = [];

  lines.forEach(line => {
    addressLines.push(line);
  });

  return addressLines;
};

export const formatDetailsAddress = details => {
  const addressLines = [];

  for (let i = 1; i < 6; i++) {
    const key = `AddressLine${i}`;
    if (details[key]) {
      addressLines.push(details[key]);
    }
  }

  return addressLines;
};

export const getPostCodeFromString = addressText => {
  const last4 = addressText.substr(addressText.length - 4);

  const matches = last4.match(/^\d{4}$/);

  // Some partials don't have post code
  if (matches) {
    return last4;
  }

  return "";
};

export const formatDeliveryDays = details => {
  const data = { deliverable: false };

  if (details.Deliverable !== "Y" || details.SourceDesc === "Physical") {
    return data;
  }

  data.deliverable = true;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  data.days = [];

  days.forEach(day => {
    const key = `DeliveredOn${day}`;

    if (details[key] !== null) {
      data.days.push({
        day,
        deliverable: details[key]
      });
    }
  });

  return data;
};

export const getCoordinates = details => {
  let mapLocation = null;
  if(details['NZGD2kCoord']['coordinates'].length > 0){
    mapLocation = [
      details['NZGD2kCoord']['coordinates'][0],
      details['NZGD2kCoord']['coordinates'][1]
    ];
  }
  return mapLocation;
};

