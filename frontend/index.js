import { backend } from "declarations/backend";

let shoppingList = [];

async function loadItems() {
    try {
        shoppingList = await backend.getItems();
        renderList();
    } catch (error) {
        console.error("Failed to load items:", error);
    }
}

function renderList() {
    const list = document.getElementById("shoppingList");
    list.innerHTML = "";
    
    shoppingList.sort((a, b) => a.id - b.id).forEach(item => {
        const li = document.createElement("li");
        if (item.completed) {
            li.classList.add("completed");
        }
        
        li.innerHTML = `
            <button class="toggle-btn" onclick="window.toggleItem(${item.id})">
                <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
            <span>${item.text}</span>
            <button class="delete-btn" onclick="window.deleteItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        list.appendChild(li);
    });
}

async function addItem() {
    const input = document.getElementById("newItem");
    const text = input.value.trim();
    
    if (text) {
        try {
            const newItem = await backend.addItem(text);
            shoppingList.push(newItem);
            input.value = "";
            renderList();
        } catch (error) {
            console.error("Failed to add item:", error);
        }
    }
}

window.toggleItem = async (id) => {
    try {
        const updatedItem = await backend.toggleItem(id);
        if (updatedItem) {
            const index = shoppingList.findIndex(item => item.id === id);
            if (index !== -1) {
                shoppingList[index] = updatedItem;
                renderList();
            }
        }
    } catch (error) {
        console.error("Failed to toggle item:", error);
    }
};

window.deleteItem = async (id) => {
    try {
        const success = await backend.deleteItem(id);
        if (success) {
            shoppingList = shoppingList.filter(item => item.id !== id);
            renderList();
        }
    } catch (error) {
        console.error("Failed to delete item:", error);
    }
};

// Event Listeners
document.getElementById("addButton").addEventListener("click", addItem);
document.getElementById("newItem").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addItem();
    }
});

// Initial load
loadItems();
