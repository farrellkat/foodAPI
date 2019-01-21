    fetch("http://localhost:8088/foods")
        .then(foods => foods.json())
        .then(parsedFoods => {
            console.table(parsedFoods)
        })

// fetch("http://localhost:8088/foods")
//     .then(foods => foods.json())
//     .then(parsedFoods => {
//         parsedFoods.forEach(food => {
//             console.log(food)
//             const foodAsHTML = foodFactory(food)
//             console.log(foodAsHTML)
//             addFoodToDom(foodAsHTML)
//         })
//     })

fetch("http://localhost:8088/foods")
    .then(response => response.json())
    .then(myParsedFoods => {
        myParsedFoods.forEach(food => {
            console.log(food) // Should have a `barcode` property

            // Now fetch the food from the Food API
            fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`)
                .then(response => response.json())
                .then(productInfo => {
                    console.log(productInfo)
                    // food.ingredients = productInfo.product.ingredients.map(i => {
                    //     return `<li>${i.text}</li>`
                    // }).join("")
                    food.ingredients = productInfo.product.ingredients.reduce((a, c) => {
                      return `${a}<li>${c.text}</li>`
                    },"")
                    
                    food.country = productInfo.product.countries
                    food.calories = productInfo.product.nutriments.energy_serving
                    food.fat = productInfo.product.nutriments.fat_serving
                    food.sugars = productInfo.product.nutriments.sugars_serving
                    
                    // Produce HTML representation
                    const foodAsHTML = foodFactory(food)

                    // Add representaiton to DOM
                    addFoodToDom(foodAsHTML)
                })
        })
    })


    const foodFactory = (food) => {
        return `
                <div class="food__items">
                <h3>${food.name}</h3>
                <div class="descriptions ethnicity">${food.ethnicity}</div>
                <div class="descriptions category">${food.category}</div>
                <h4>Ingredients</h4>
                <div class="descriptions ingredients">${food.ingredients}</div>
                <h4>Country</h4>
                <div class="descriptions country">${food.country}</div>
                <h4>Calories Per Serving</h4>
                <div class="descriptions calories">${food.calories}</div>
                <h4>Fat Per Serving</h4>
                <div class="descriptions fat">${food.fat}</div>
                <h4>Sugars Per Serving</h4>
                <div class="descriptions sugar">${food.sugars}</div>

    </div>
                `
    }

    const addFoodToDom = (foodAsHTML) => {
        document.querySelector(".foodList").innerHTML += foodAsHTML
    }
