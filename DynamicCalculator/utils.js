document.addEventListener('DOMContentLoaded', () => new page());

let itemName = document.querySelector('#item-name');
let itemValue = document.querySelector('#item-value');
let form = document.querySelector('#container');
let items = document.querySelector('#items');
let total = document.querySelector('#total');

class page {
  constructor() {
    this.itemName = itemName;
    this.itemValue = itemValue;
    this.form = form;
    this.items = items;
    this.total = total;
    this.form.addEventListener('submit', this.addItem);
    document.body.addEventListener('click',(event)=>{
      if (event.target.classList.contains('delete-item')){
        const element = event.target.parentElement;
        const total = Number(this.total.innerText) - Number(element.name);
        this.total.innerText = total;
        element.remove();
      }
    });
  }

  addItem = (event) => {
    event.preventDefault();
    if(this.itemName.value == "" || this.itemValue.value == "" || isNaN(this.itemValue.value) || Number(this.itemValue.value < 0)){
      this.form.style = 'border: 10px solid red';
      return;
    }
    const element = document.createElement('div');
    element.append(`name: ${this.itemName.value} price: ${this.itemValue.value}`);
    element.name = this.itemValue.value;
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'delete';
    deleteButton.classList.add('delete-item');
    element.appendChild(deleteButton);
    this.items.appendChild(element);
    this.total.innerText = Number(this.itemValue.value) + Number(this.total.innerText);
  };
}