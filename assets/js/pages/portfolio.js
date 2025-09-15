document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('#filter-buttons .btn[data-filter]');

    if (window.loadProjects) {
        loadProjects('#project-list').then(() => {
            const allProjects = document.querySelectorAll('#project-list .project-item');

            function applyFilter(filter) {
                allProjects.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    applyFilter(this.getAttribute('data-filter'));
                });
            });

            applyFilter('all');
        });
    }
});
