function get_element_li (name, price) {
    return `<li class="added-item">name: ${name} price: ${price}  <button class="remove-item">remove</button></li>`
  }
  
  let add_item_to_list_with_template = (template_function) => {
    return (event) => {
      /*
        add the item to the list
        add event listener to the button inside the element just added with the remove_item function
        add the value to the total
      */
    }
  }
  /*
   for removing elements could be this way
    let element_to_delete = document.querySelector("selector").lastElementChild;
    element_to_delete.parentNode.removeChild(element_to_delete);
    or we could use ChildNode.remove()
    https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
  */
  
  let remove_item  = (node_to_remove) => {
  
  }