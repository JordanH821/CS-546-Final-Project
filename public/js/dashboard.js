
let columnCurrentlyDragging;
let cardCurrentlyDragging;

function sizeColumns() {
    // get position of column container
    const scrollView = document.getElementsByClassName("columnScrollView")[0];
    const positionPercent = scrollView.getBoundingClientRect().top / (window.innerHeight - 50);

    // set the column height to fill in the bottom half the of viewport
    const scrollViewHeight = (1 - positionPercent) * 100;
    var columns = document.getElementsByClassName('columnScrollView');
    for (let i = 0; i < columns.length; i++) {
        columns[i].style.height = scrollViewHeight + "vh";
    };
}

function dashboardAllowDrop(ev) {
    ev.preventDefault();
}

function dashboardOnDrag(ev) {
    cardCurrentlyDragging = ev.target;
    columnCurrentlyDragging = findColumnForTaskCard(cardCurrentlyDragging);
}

function dashboardOnDrop(ev) {
    const column = findColumnForTaskCard(ev.target);

    // do not re-drag task cards into the column it was already in
    if (column == columnCurrentlyDragging) {
        return;
    }

    // move task to column
    if (column) {
        column.appendChild(cardCurrentlyDragging);
        cardCurrentlyDragging.scrollIntoView();
    }
}

function findColumnForTaskCard(taskCard) {

    // find column
    let current = taskCard;

    // continue to traverse up until we find a column or there is no parent node
    while (true) {
        if (current.classList.contains("columnScrollView")) {
            return current;
        } else {
            if (current.parentNode) {
                current = current.parentNode
            } else {
                return null;
            }
        }
    }
}

