// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.querySelector('#grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit option
let editElement
let editFlag = false
let editId = ''

// ****** EVENT LISTENERS **********
// ------submit form-------
form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)
window.addEventListener('DOMContentLoaded', setUpItems)


// localStorage.removeItem('list')
// ****** FUNCTIONS **********
function addItem (e) {
    e.preventDefault()
    const value = grocery.value
    const id = new Date().getTime().toString()

    if(value && !editFlag) {
       createItems(id, value)
        //display alert success msg
        displayAlert('Item added to the list', 'success') 
        container.classList.add('show-container')

        //add to localstorage
        addToLocalStorage(id, value)
        // set back to default
        setBackToDefault()

    } else if(value && editFlag) {
        editElement.innerHTML = value
        displayAlert('item has been edited', 'success')
        // edit localStorage
        editLocalStorage(editId, value)
        setBackToDefault()
    } else {
        displayAlert('Please enter a value', 'danger')
    }
}

// -----display alert------
function displayAlert(text, action) {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)
    setTimeout(() => {
        alert.textContent = ''
        alert.classList.remove(`alert-${action}`)
    }, 2500)
}
// ----set back to default----
function setBackToDefault() {
    grocery.value = ''
    editId = ''
    editFlag = false
    submitBtn.textContent = 'submit'
}

// -----clear list------
function clearItems() {
    const items = document.querySelectorAll('.grocery-item')
    if(items.length > 0) {
        items.forEach(item => item.remove())
    }
    displayAlert('Items removed successfullly', 'success')
    container.classList.remove('show-container')    

    setBackToDefault()
    localStorage.removeItem('list')
}
//------delete item------
function deleteItem(e) {
    const element = e.currentTarget.closest('.grocery-item')
    const title = element.querySelector('.title').textContent
    displayAlert(`You have removed ${title}`, 'success')
    const id = element.dataset.id
    element.remove()
    if(list.children.length === 0) {
        container.classList.remove('show-container')
    }
 
    //set to default
    setBackToDefault()

    //remove from localstorage
    removeFromLocalStorage(id)
}

//------edit item------
function editItem(e) {
    const element = e.currentTarget.closest('.grocery-item')
    editElement = element.querySelector('.title')
    grocery.value = editElement.textContent
    editFlag = true
    editId = element.dataset.id
    submitBtn.textContent = 'Edit'
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = {id, value}
    let items = getLocalStorage()

    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
    // console.log('removed from localstorage...') 
    let items = getLocalStorage()
    items = items.filter(item => {
        if(item.id !== id) {
            return item
        }
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function editLocalStorage(id, value) {
    // console.log('editing localStorage...')
    let items = getLocalStorage()
    items = items.map(item => {
        if(item.id === id) {
            item.value = value
        }
        return item
    })
    localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem('list') 
    ? JSON.parse(localStorage.getItem('list')) : []
}

// ****** SETUP ITEMS **********
function setUpItems() {
    let items = getLocalStorage()
    if(items.length > 0) {
        items.forEach(item => {
            createItems(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

function createItems(id, value) {
    const element = document.createElement('article')
    element.classList.add('grocery-item')
    const attr = document.createAttribute('data-id')
    attr.value = id
    element.setAttributeNode(attr)

    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn">edit</button>
      <button class="delete-btn">delete</button>
    </div>
    `       
    //get btns
    const deleteBtn = element.querySelector('.delete-btn')
    const editBtn = element.querySelector('.edit-btn')
    //add event listener to btns
    deleteBtn.addEventListener('click', deleteItem)
    editBtn.addEventListener('click', editItem)
    list.append(element)
}