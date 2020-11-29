
var cardCurrentlyDragging;

sizeColumns();

function sizeColumns() {
    // get position of column container
    const columnsContainer = document.getElementById("columnsContainer");
    const positionPercent = columnsContainer.getBoundingClientRect().bottom / (window.innerHeight - 24);

    // set the column height to fill in the bottom half the of viewport
    const columnHeight = (1 - positionPercent) * 100;
    var columns = document.getElementsByClassName('column');
    for (let i = 0; i < columns.length; i++) {
        columns[i].style.height = columnHeight + "vh";
    };
}

function dashboardAllowDrop(ev) {
     ev.preventDefault();
}

function dashboardOnDrag(ev) {
    cardCurrentlyDragging = ev.target;
}

function dashboardOnDrop(ev) {
    
    // find column
    let current = ev.target;
    let column;
    while (!column) {
        if (current.classList.contains("column")) {
            column = current;
        } else {
            if (current.parentNode) {
                current = current.parentNode
            } else {
                break;
            }
        }
    }

    // move task to column
    if (column) {
        column.appendChild(cardCurrentlyDragging);
    }
}
