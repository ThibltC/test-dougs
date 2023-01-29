import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

dayjs.extend(isBetween);

const getBalanceSections = (sortedBalances) => {
	return sortedBalances.reduce((result, currentBalance, index, allBalances) => {
		const nextBalance = allBalances[index + 1];
		if (nextBalance) {
			const balanceGap = nextBalance.balance - currentBalance.balance;
			const dates = {
				from: dayjs(currentBalance.date).add(1, "day"),
				to: dayjs(nextBalance.date),
			};

			result.push({
				section: index + 1,
				balanceGap,
				dates,
			});
		}
		return result;
	}, []);
};

const getDuplicateMovementsWithOverAmount = (indexedMovements) => {
	const duplicateMovements = []
	const tmpIndexes = []
	let overAmount = 0

	for (const movement of indexedMovements) {
		if (!tmpIndexes.includes(movement.index)) {
			tmpIndexes.push(movement.index)
		} else {
			duplicateMovements.push(movement)
			overAmount = overAmount + movement.amount
		}
	}

	return {
		list: duplicateMovements,
		overAmount
	}
}

export const checkMovementsWithBalances = (movements, balances) => {
	const sortedBalances = [...balances].sort((a, b) =>
		dayjs(a.date).diff(dayjs(b.date))
	);

	const borderMovements = []
	const indexedMovements = []
	const otherAnomalies = {
		section: null,
		dates: null,
		gap: null,
		anomalies: []
	}

	for (const movement of movements) {
		if (!dayjs(movement.date).isBetween(
			sortedBalances[0].date,
			sortedBalances[sortedBalances.length - 1].date
		)) {
			borderMovements.push(movement.id)
		}
		indexedMovements.push({ ...movement, index: `${movement.wording}-${movement.amount}-${movement.date.getTime()}` })
	}
	if (borderMovements.length) {
		otherAnomalies.anomalies.push({
			message: "vérification impossible par manque de point de contrôle",
			ids: borderMovements
		})
	}

	const reasons = getBalanceSections(sortedBalances)
		.map((balance) => {
			const sectionMovements = []
			let totalAmount = 0
			for (const indexedMovement of indexedMovements) {
				if (dayjs(indexedMovement.date).isBetween(
					balance.dates.from,
					balance.dates.to
				)) {
					sectionMovements.push(indexedMovement)
					totalAmount = totalAmount + indexedMovement.amount
				}
			}

			const section = {
				section: balance.section,
				dates: {
					from: balance.dates.from.format("DD/MM/YYYY"),
					to: balance.dates.to.format("DD/MM/YYYY")
				},
				gap: totalAmount - balance.balanceGap,
				anomalies: []
			}
			const duplicateMovements = getDuplicateMovementsWithOverAmount(sectionMovements)

			if (duplicateMovements.list.length) {
				section.gap = section.gap - duplicateMovements.overAmount
				section.anomalies.push({
					message: "une ou plusieurs opérations sont dupliquée",
					ids: duplicateMovements.list.map(m => m.id)
				})
			}
			if (section.gap !== 0) {
				section.anomalies.push({
					message: "une ou plusieurs opérations sont manquantes",
					ids: null
				})
			}
			return section
		})
		.filter((e) => e.anomalies.length);

	const reasonsWithOtherAnomalies = [...(otherAnomalies.anomalies.length ? [otherAnomalies] : []), ...reasons]

	if (!reasonsWithOtherAnomalies.length) return "la comptabilité est correct";
	return reasonsWithOtherAnomalies
};
