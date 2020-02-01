export function shortenNumberText(number) {
    if (!number) {
        return 0;
    }

    if (Math.abs(number) >= 1000000000000) {
        return (
            parseFloat(
                Math.sign(number) *
                    (Math.abs(number) / 1000000000000).toFixed(1)
            ) + "T"
        );
    }

    if (Math.abs(number) >= 1000000000) {
        return (
            parseFloat(
                Math.sign(number) * (Math.abs(number) / 1000000000).toFixed(1)
            ) + "B"
        );
    }

    if (Math.abs(number) >= 1000000) {
        return (
            parseFloat(
                Math.sign(number) * (Math.abs(number) / 1000000).toFixed(1)
            ) + "M"
        );
    }

    if (Math.abs(number) >= 1000) {
        return (
            parseFloat(
                Math.sign(number) * (Math.abs(number) / 1000).toFixed(1)
            ) + "k"
        );
    } else {
        return parseFloat(parseFloat(number).toFixed(1)) + "";
    }
}

export function connectionText(number) {
    const str = "" + Math.floor(number);
    const result = str + "%";
    return result;
}

export function getPopulationPercentiles(planetsObjects) {
    const percentileCount = 5;

    const populations = planetsObjects.map(p => p);
    populations.sort(p => p.model.getPopulation());
    console.log(populations);
    const countPerPercentile = Math.ceil(populations.length / percentileCount);
    console.log(countPerPercentile);
    return [
        populations.slice(0, countPerPercentile),
        populations.slice(countPerPercentile, 2 * countPerPercentile),
        populations.slice(2 * countPerPercentile, 3 * countPerPercentile),
        populations.slice(3 * countPerPercentile, 4 * countPerPercentile),
        populations.slice(4 * countPerPercentile, populations.length),
    ];
}
