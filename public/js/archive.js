const columnMapping = {
    toDoColumn: 'To Do',
    inProgressColumn: 'In Progress',
    doneColumn: 'Done',
};

let columnCurrentlyDragging;
let cardCurrentlyDragging;

function sizeColumns() {
    // get position of column container
    const scrollView = document.getElementsByClassName('columnScrollView')[0];
    const positionPercent =
        scrollView.getBoundingClientRect().top / (window.innerHeight - 50);

    // set the column height to fill in the bottom half the of viewport
    const scrollViewHeight = (1 - positionPercent) * 100;
    var columns = document.getElementsByClassName('columnScrollView');
    for (let i = 0; i < columns.length; i++) {
        columns[i].style.height = scrollViewHeight + 'vh';
    }
}

// calls sizeColumns() on page load
$(sizeColumns);

$('#searchForm').on('submit', (event) => {
    try {
        validateStringInput($('#searchTerm').val().trim(), 'Search Term');
    } catch (e) {
        event.preventDefault();
        $('#searchTerm').addClass('invalidInput');
    }
});

function taskClicked(event) {
    event.stopPropagation();
    window.open('http://localhost:3000/tasks/' + event.target.dataset.taskid,'_self',false);
}

function taskOnMouseOver(event) {
    event.target.classList.add('taskOnMouse');
}

function taskOnMouseExit(event) {
    event.target.classList.remove('taskOnMouse')
}