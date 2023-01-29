import { checkMovementsWithBalances } from "../src/checkMovementsWithBalances.js";
import { expect } from "chai";
import { simpleBalances, simpleMovements, missingMovements, duplicateMovements, outsideMovements, duplicateAndMissingMovements, complexeMovements, complexeBalances } from './_mocks_.js'


describe("Accounting verification", () => {
  it("Accounting is ok", () => {
    expect(checkMovementsWithBalances(simpleMovements, simpleBalances)).to.equal(
      "la comptabilité est correct"
    );
  });
  it("Accounting with duplicate movements only", () => {
    expect(checkMovementsWithBalances(duplicateMovements, simpleBalances)).to.deep.equal(
      [{
        section: 1,
        dates: {
          from: "01/03/2022",
          to: "31/03/2022"
        },
        gap: 0,
        anomalies:
          [
            {
              message: "une ou plusieurs opérations sont dupliquée",
              ids: [3, 4]
            }
          ]
      }]
    )
  })
  it("Accounting with missing movements only", () => {
    expect(checkMovementsWithBalances(missingMovements, simpleBalances)).to.deep.equal(
      [{
        section: 1,
        dates: {
          from: "01/03/2022",
          to: "31/03/2022"
        },
        gap: -50,
        anomalies:
          [
            {
              message: "une ou plusieurs opérations sont manquantes",
              ids: null
            }
          ]
      }]
    )
  })
  it("Accounting with duplicate AND missing movements", () => {
    expect(checkMovementsWithBalances(duplicateAndMissingMovements, simpleBalances)).to.deep.equal(
      [{
        section: 1,
        dates: {
          from: "01/03/2022",
          to: "31/03/2022"
        },
        gap: 250,
        anomalies:
          [
            {
              message: "une ou plusieurs opérations sont dupliquée",
              ids: [3, 4]
            },
            {
              message: "une ou plusieurs opérations sont manquantes",
              ids: null
            }
          ]
      }]
    )
  })
  it("Accounting with border effects only", () => {
    expect(checkMovementsWithBalances(outsideMovements, simpleBalances)).to.deep.equal(
      [{
        section: null,
        dates: null,
        gap: null,
        anomalies:
          [
            {
              message: "vérification impossible par manque de point de contrôle",
              ids: [23, 44]
            },
          ]
      }]
    )
  })
  it("Accounting complexe", () => {
    expect(checkMovementsWithBalances(complexeMovements, complexeBalances)).to.deep.equal(
      [{ "section": null, "dates": null, "gap": null, "anomalies": [{ "message": "vérification impossible par manque de point de contrôle", "ids": [81] }] }, { "section": 1, "dates": { "from": "01/02/2022", "to": "28/02/2022" }, "gap": -200, "anomalies": [{ "message": "une ou plusieurs opérations sont dupliquée", "ids": [143, 144] }, { ids: null, message: "une ou plusieurs opérations sont manquantes" }] }, { "section": 3, "dates": { "from": "01/04/2022", "to": "30/04/2022" }, "gap": 300, "anomalies": [{ "message": "une ou plusieurs opérations sont manquantes", "ids": null }] }]
    )
  })
});
