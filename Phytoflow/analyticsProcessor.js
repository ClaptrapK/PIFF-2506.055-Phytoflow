export function getNumeric(v) {
  if (v == null) return 0;

  return parseFloat(
    String(v).replace(/[^\d.-]/g, "")
  ) || 0;
}

export function groupBy30Minutes(data) {

  const sorted = [...data]
    .sort(
      (a, b) =>
        new Date(
          a.timestamp
            .split(" ")
            .reverse()
        ) -
        new Date(
          b.timestamp
            .split(" ")
            .reverse()
        )
    );

  const groups = {};

  sorted.forEach(item => {

    const date = new Date();

    const hour =
      date.getHours();

    const minute =
      date.getMinutes() < 30
        ? "00"
        : "30";

    const key =
      `${hour}:${minute}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
  });

  return Object.entries(groups)
    .map(([time, values]) => ({

      time,

      airTemp:
        avg(
          values.map(
            v =>
              getNumeric(
                v.airTemp
              )
          )
        ),

      leafTemp:
        avg(
          values.map(
            v =>
              getNumeric(
                v.leafTemp
              )
          )
        ),

      humidity:
        avg(
          values.map(
            v =>
              getNumeric(
                v.airHumidity
              )
          )
        ),

      soil:
        avg(
          values.map(
            v =>
              getNumeric(
                v.soilMoisture
              )
          )
        ),

      sapFlow:
        avg(
          values.map(
            v =>
              v.sapFlowValue || 0
          )
        ),

      Ks:
        avg(
          values.map(
            v =>
              v.KsValue || 0
          )
        )
    }));
}

function avg(arr) {

  if (!arr.length) {
    return 0;
  }

  return (
    arr.reduce(
      (a, b) => a + b,
      0
    ) / arr.length
  );
}
