
import ItemModel from "../model/ItemModel.js";

let recordIndex;

initialize();


function initialize() {
    $.ajax({
        url: "http://localhost:8080/item",
        type: "GET",
        data: { "nextid": "nextid" },
        success: (res) => {
            let code = res.substring(1, res.length - 1);
            console.log(code);
            $("#itemCode").val(code);
        },
        error: (err) => {
            console.error(err);
        }
    });
}



function nextId() {
    $.ajax({
        url: "http://localhost:8080/item",
        type: "GET",
        data: { "nextid": "nextid" },
        success: (res) => {
            let code = res.substring(1, res.length - 1);
            console.log(code);
            $("#itemCode").val(code);
        },
        error: (err) => {
            console.error(err);
        }
    });
}

// Function to validate item name
function validateItemName(name) {
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (!name || name.trim() === "") {
        alert("Item name cannot be empty.");
        return false;
    }
    if (!lettersOnlyRegex.test(name)) {
        alert("Item name can only contain letters and spaces.");
        return false;
    }
    return true;
}

// Function to validate item price
function validateItemPrice(price) {
    if (!price || isNaN(price) || price <= 0) {
        alert("Item price must be a positive number.");
        return false;
    }
    return true;
}

// Function to validate item quantity
function validateItemQty(qty) {
    if (!qty || isNaN(qty) || qty <= 0) {
        alert("Item quantity must be a positive number.");
        return false;
    }
    return true;
}


$("#item-save").on('click', () => {
    const itemCode = $("#itemCode").val();
    const itemName = $("#item_name").val();
    const itemPrice = $("#item_price").val();
    const itemQty = $("#item_qty").val();


    if (!validateItemName(itemName)) return;
    if (!validateItemPrice(itemPrice)) return;
    if (!validateItemQty(itemQty)) return;

    $('#close-item-model').click();

    const newItem = new ItemModel(itemCode, itemName, itemPrice, itemQty); // Create new item instance
    let jsonItem = JSON.stringify(newItem); // Convert item to JSON

    $.ajax({
        url: "http://localhost:8080/item",
        type: "POST",
        data: jsonItem,
        headers: { "Content-Type": "application/json" },
        success: (res) => {
            console.log(JSON.stringify(res));
            alert("Item saved successfully");
            initialize();
        },
        error: (err) => {
            console.error(err);
        }
    });

    loadItemTable(items); // Reload item table
    $("#itemCode").val(nextId());
});

// Item selection change event
$("#inputGroupSelect-item").on('change', () => {
    const selectedItemCode = $('#inputGroupSelect-item').val();

    if (selectedItemCode !== 'select the item') {
        const selectedItem = items.find(item => item.itemCode === selectedItemCode);
        if (selectedItem) {
            $("#item-tbl-body").empty();
            const record = `<tr>
                <td class="item-code-value">${selectedItem.itemCode}</td>
                <td class="item-name-value">${selectedItem.name}</td>
                <td class="item-price-value">${selectedItem.price}</td>
                <td class="item-qty-value">${selectedItem.qty}</td>
            </tr>`;
            $("#item-tbl-body").append(record);
        }
    } else {
        loadItemTable(items);
    }
});

// Function to load items into the table
function loadItemTable() {
    $("#item-tbl-body").empty();
    let itemArray = [];

    $.ajax({
        url: "http://localhost:8080/item",
        type: "GET",
        data: { "all": "getAll" },
        success: (res) => {
            console.log(res);
            itemArray = JSON.parse(res);
            console.log(itemArray);
            /*setItemIds(itemArray);*/

            itemArray.map((item, index) => {
                const record = `<tr>
                    <td class="item-code-value">${item.itemCode}</td>
                    <td class="item-name-value">${item.name}</td>
                    <td class="item-price-value">${item.price}</td>
                    <td class="item-qty-value">${item.qty}</td>
                </tr>`;
                $("#item-tbl-body").append(record);
            });
        },
        error: (err) => {
            console.error(err);
        }
    });
}

// Item table row click event to select an item
$("#item-tbl-body").on('click', 'tr', function () {
    recordIndex = $(this).index();
    const code = $(this).find(".item-code-value").text();
    const name = $(this).find(".item-name-value").text();
    const price = $(this).find(".item-price-value").text();
    const qty = $(this).find(".item-qty-value").text();

    $("#itemCode").val(code);
    $("#item_name").val(name);
    $("#item_price").val(price);
    $("#item_qty").val(qty);
});

// Delete item button click event
$("#item-delete").on('click', () => {
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
        items.splice(recordIndex, 1);
        alert("Item deleted successfully");
        loadItemTable(items);
    } else {
        alert("Delete canceled");
    }
});

// Close item modal button click event
$('#close-item-model').on('click', () => {
    $('#itemCode').val('');
    $('#item_name').val('');
    $('#item_price').val('');
    $('#item_qty').val('');
});

// Exit item modal button click event
$('#exite-item-model').on('click', () => {
    $('#staticBackdrop-item').modal('hide');
});

// Review item button click event
$('#revew-item').on('click', () => {
    const itemCode = $('#itemCode').val();
    const itemIndex = items.findIndex(i => i.itemCode === itemCode);

    if (itemIndex !== -1) {
        const selectedItem = items[itemIndex];
        $("#item_name").val(selectedItem.name);
        $("#item_price").val(selectedItem.price);
        $("#item_qty").val(selectedItem.qty);

        console.log("Item details filled successfully.");
    } else {
        alert("Item with the entered code does not exist.");
    }
});

// Update item button click event
$('#update-item').on('click', () => {
    const code = $("#itemCode").val();
    const name = $("#item_name").val();
    const price = $("#item_price").val();
    const qty = $("#item_qty").val();

    if (code) {
        $("#staticBackdrop-item").modal("show");
        $("#itemCode").val(code);
        $("#item_name").val(name);
        $("#item_price").val(price);
        $("#item_qty").val(qty);
    } else {
        alert("Please select an item from the table.");
    }
});

// Update item modal button click event
$("#update-item-model").on("click", () => {
    const updatedCode = $("#itemCode").val();
    const updatedName = $("#item_name").val();
    const updatedPrice = $("#item_price").val();
    const updatedQty = $("#item_qty").val();

    const itemIndex = items.findIndex(i => i.itemCode === updatedCode);

    if (itemIndex !== -1) {
        items[itemIndex].name = updatedName;
        items[itemIndex].price = updatedPrice;
        items[itemIndex].qty = updatedQty;

        console.log("Updated Item Code:", updatedCode);
        console.log("Updated Item Name:", updatedName);
        console.log("Updated Item Price:", updatedPrice);
        console.log("Updated Item Quantity:", updatedQty);

        loadItemTable(items);
        $("#staticBackdrop-item").modal("hide");
    } else {
        alert("Item with the entered code does not exist.");
    }
});

// Function to load items into a combo box




// Load all items button click event
$('#all-item').on('click', () => {
    loadItemTable();
});
