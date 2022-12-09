module.exports = (temp, prod) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, prod.productName);
    output = output.replace(/{%EMOJI%}/g, prod.image);
    output = output.replace(/{%NUTRIENTS%}/g, prod.nutrients);
    output = output.replace(/{%QUANTITY%}/g, prod.quantity);
    output = output.replace(/{%PRICE%}/g, prod.price);
    output = output.replace(/{%PRICE%}/g, prod.price);
    output = output.replace(/{%FROM%}/g, prod.from);
    output = output.replace(/{%ID%}/g, prod.id);
    output = output.replace(/{%DESCRIPTION%}/g, prod.description);

    if (!prod.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}