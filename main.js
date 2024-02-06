const search = document.querySelector('.search-bar');
const autocompleteList = document.querySelector('.autocompleteList');
const reposList = document.querySelector('.reposList');


function createNewElement(tagName, className) {
    const newElement = document.createElement(tagName);

    if(className) {
        newElement.classList.add(className);
    }

    return newElement;
}


function makeCard(arrProperties) {
    let fragment = document.createDocumentFragment();

    arrProperties.forEach(function(prop) {
        let paragraph = document.createElement('p');
        paragraph.textContent = prop;
        fragment.appendChild(paragraph);
    });

    return fragment;
}

function addRepository(repItem) {
   

    const repositoryName = `Name: ${repItem.full_name}`;
    const ownerName = `Owner: ${repItem.owner.login}`;
    const numOfStarts = `Stars: ${repItem.stargazers_count}`;

    const cardWrapper = createNewElement(`div`, 'repoCard');
    
    const removeButton = createNewElement('button', 'removeBtn');
    removeButton.addEventListener('click', () => {
        reposList.removeChild(cardWrapper);
    })

    removeButton.textContent = `Delete card`;
    
    reposList.appendChild(cardWrapper);
    cardWrapper.appendChild(makeCard([repositoryName, ownerName, numOfStarts]));
    cardWrapper.appendChild(removeButton);
 }
 

function searchRepos(value) {
    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const itemsArr = data.items;
        console.log(itemsArr)
        autocompleteList.textContent = '';
        itemsArr.forEach(element => {
            console.log(element)
            const autocompleteItem = createNewElement('li', 'autocompleteElement');
            autocompleteItem.textContent = element.name;
            autocompleteList.appendChild(autocompleteItem);
            autocompleteItem.addEventListener('click', () => {
                addRepository(element);
                autocompleteList.textContent = '';
                search.value = '';
            })
        });
        
    })
}

let timerId; 

search.addEventListener('input', (event) => {
    const value = event.target.value;
    if (value === '') {
        autocompleteList.textContent = '';
    } else {
       clearTimeout(timerId);
       timerId = setTimeout(() => {
        searchRepos(value);
       }, 180);
    }
 });



