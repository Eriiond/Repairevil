export function shortenNumberText(number) {
    if (Math.abs(number) >= 1000000000000) {
        return (
            parseFloat(
                Math.sign(number) *
                    (Math.abs(number) / 1000000000000).toFixed(1)
            ) + "T"
        )
    }

    if (Math.abs(number) >= 1000000000) {
        return (
            parseFloat(
                Math.sign(number) * (Math.abs(number) / 1000000000).toFixed(1)
            ) + "B"
        )
    }

    if (Math.abs(number) >= 1000000) {
        return (
            parseFloat(
                Math.sign(number) * (Math.abs(number) / 1000000).toFixed(1)
            ) + "M"
        )
    }

    if (Math.abs(number) >= 1000) {
        return (
            parseFloat(
                Math.sign(number) * (Math.abs(number) / 1000).toFixed(1)
            ) + "k"
        )
    } else {
        return parseFloat(number.toFixed(1)) + ""
    }
}

export function connectionText(number) {
    const str = "" + Math.floor(number)
    const result = str + "%"
    return result
}
