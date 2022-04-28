const ADRESS = "https://www.monogo.pl/competition/input.txt";
const https = require("https");
const CORRECT_PRICE = 200;

https
  .get(ADRESS, (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });

    resp.on("end", () => {
      const parsedData = JSON.parse(data);
      const products = parsedData.products.map((product) => {
        const id = product.id;
        product.color = parsedData.colors.find((c) => c.id === id).value;
        product.size = parsedData.sizes.find((c) => +c.id === id)?.value;
        return product;
      });
      const filtereredProducts = products.filter((product) => {
        const wrightColor = parsedData.selectedFilters.colors.some(
          (sf) => sf === product.color
        );
        const wrigthSize = parsedData.selectedFilters.sizes.some(
          (sf) => sf === product.size
        );
        return wrightColor && wrigthSize;
      });
      const correctPrize = filtereredProducts.filter(
        (product) => product.price > CORRECT_PRICE
      );
      const prices = correctPrize.map((product) => product.price);
      const maxPrize = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const multiplied = maxPrize * minPrice;
      const rounded = Math.round(multiplied);
      const resultStr = rounded.toString();
      const resultArr = resultStr.split("");
      const result = [];
      resultArr.forEach((num, index) => {
        if (index % 2 === 0) {
          result.push(+resultArr[index] + (+resultArr[index + 1] || 0));
        }
      });

      console.log(result);
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
