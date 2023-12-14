const btn = document.querySelector(".btn");
const item = document.querySelector("#items");
const apiUrl = "https://crudcrud.com/api/7005f44606c542969bbe5a0aeeb1bbae/Candy";

btn.addEventListener("click", submitItem);

window.addEventListener("DOMContentLoaded", () => {
    axios
    .get(apiUrl)
    .then((res) => {
        for (var i=0; i< res.data.length; i++) {
            showList(res.data[i]);
        }
    })
    .catch((err) => console.log(err));
});

function submitItem(e) {
    e.preventDefault();
    const itemName = document.querySelector("#name").value;
    const itemDesc = document.querySelector("#description").value;
    const itemPrice = document.querySelector("#Price").value;
    const itemQuantity = document.querySelector("#Quantity").value;

    if (
        itemName === "" ||
        itemDesc === "" ||
        itemPrice === "" ||
        itemQuantity === ""
    ) {
        const msg = document.querySelector(".msg");
        msg.classList.add("error");
        msg.innerHTML = "Please enter a value in all the fields";
        setTimeout(() => msg.remove(), 3000);
    } else {
        let obj = {
            itemName: itemName,
            itemDesc: itemDesc,
            itemPrice: itemPrice,
            itemQuantity: itemQuantity,
        };

        axios
            .post(apiUrl, obj)
            .then((res) => {
                console.log(res.data);
                const newItem = res.data;
                showList(newItem);
            })
            .catch((err) => console.log(err));
    }
}

function showList(obj) {
    const li = document.createElement("li");
    li.appendChild(
        document.createTextNode(`${obj.itemName} - ${obj.itemDesc} - ${obj.itemPrice} - ${obj.itemQuantity}`)
    );

    item.appendChild(li);
    const buyOneBtn = createButton("Buy One", 1, obj, li);
    const buyTwoBtn = createButton("Buy Two", 2, obj, li);
    const buyThreeBtn = createButton("Buy Three", 3, obj, li);

    li.appendChild(buyOneBtn);
    li.appendChild(buyTwoBtn);
    li.appendChild(buyThreeBtn);
}

function createButton(text, quantity, obj, listItem) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", () => {
        buyItem(obj, quantity, listItem);
    });
    return button;
}

async function buyItem(obj, quantityToBuy, listItem) {
    try {
        const currentQuantity = parseInt(obj.itemQuantity);
        if (currentQuantity >= quantityToBuy) {
            obj.itemQuantity = currentQuantity - quantityToBuy;

            await axios.put(`${apiUrl}/${obj._id}`, {
                itemQuantity: obj.itemQuantity,
                itemName: obj.itemName,
                itemPrice: obj.itemPrice,
                itemDesc: obj.itemDesc,
            });

            listItem.childNodes[0].textContent = `${obj.itemName} - ${obj.itemDesc} - ${obj.itemPrice} - ${obj.itemQuantity}`;
        } else {
            alert("Not enough stock.");
        }
    } catch (error) {
        console.error(error);
    }
}
