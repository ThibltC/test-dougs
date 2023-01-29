export const simpleBalances = [
    {
        date: new Date("02/28/2022"),
        balance: 5200,
    },
    {
        date: new Date("03/31/2022"),
        balance: 5500,
    },
];

export const complexeBalances = [
    ...simpleBalances,
    {
        date: new Date("01/31/2022"),
        balance: 200,
    },
    {
        date: new Date("05/31/2022"),
        balance: 3500,
    },
    {
        date: new Date("04/30/2022"),
        balance: 4000,
    },
];

export const simpleMovements = [
    {
        id: 221,
        date: new Date("03/05/2022"),
        wording: "facture 1",
        amount: 100,
    },
    {
        id: 222,
        date: new Date("03/24/2022"),
        wording: "facture 2",
        amount: 200,
    },
];

export const complexeMovements = [
    ...simpleMovements,
    {
        id: 81,
        date: new Date("01/31/2022"),
        wording: "border M1",
        amount: 150,
    },
    {
        id: 141,
        date: new Date("02/05/2022"),
        wording: "facture M1",
        amount: 1800,
    },
    {
        id: 143,
        date: new Date("02/05/2022"),
        wording: "facture M1",
        amount: 1800,
    },
    {
        id: 142,
        date: new Date("02/18/2022"),
        wording: "facture M3",
        amount: 3000,
    },
    {
        id: 144,
        date: new Date("02/18/2022"),
        wording: "facture M3",
        amount: 3000,
    },
    {
        id: 311,
        date: new Date("04/18/2022"),
        wording: "fefeffefe M3",
        amount: -1200,
    },
    {
        id: 411,
        date: new Date("05/18/2022"),
        wording: "fefeffefe M3",
        amount: -500,
    },
]

export const missingMovements = [
    {
        id: 23,
        date: new Date("03/05/2022"),
        wording: "facture M1",
        amount: 150,
    }, {
        id: 34,
        date: new Date("03/18/2022"),
        wording: "facture M3",
        amount: 100,
    },
]

export const duplicateMovements = [
    {
        id: 1,
        date: new Date("03/05/2022"),
        wording: "facture D1",
        amount: 300,
    },
    {
        id: 3,
        date: new Date("03/05/2022"),
        wording: "facture D1",
        amount: 300,
    },
    {
        id: 4,
        date: new Date("03/05/2022"),
        wording: "facture D1",
        amount: 300,
    },
]

export const outsideMovements = [
    {
        id: 23,
        date: new Date("01/05/2022"),
        wording: "facture M1",
        amount: 150,
    }, {
        id: 34,
        date: new Date("03/18/2022"),
        wording: "facture M3",
        amount: 300,
    }, {
        id: 44,
        date: new Date("05/18/2022"),
        wording: "facture M3",
        amount: 100,
    },
]

export const duplicateAndMissingMovements = [...duplicateMovements, ...missingMovements]