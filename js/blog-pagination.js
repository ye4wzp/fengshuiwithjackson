// ==========================================
// BLOG PAGINATION SYSTEM
// ==========================================

(function () {
    'use strict';

    const BlogPagination = {
        itemsPerPage: 6,
        currentPage: 1,
        totalItems: 0,
        blogCards: [],

        init() {
            const blogGrid = document.querySelector('.blog-page .blog-grid');
            if (!blogGrid) return;

            this.blogCards = Array.from(blogGrid.querySelectorAll('.blog-card'));
            this.totalItems = this.blogCards.length;

            if (this.totalItems <= this.itemsPerPage) return; // No pagination needed

            this.createPaginationControls();
            this.createCategoryFilter();
            this.showPage(1);
        },

        createPaginationControls() {
            const blogSection = document.querySelector('.blog-page .container');
            const newsletter = document.querySelector('.blog-newsletter');

            const pagination = document.createElement('div');
            pagination.className = 'pagination';
            pagination.innerHTML = `
                <button class="pagination-btn prev" disabled>← Previous</button>
                <div class="pagination-info">
                    <span class="page-current">1</span> / <span class="page-total">${Math.ceil(this.totalItems / this.itemsPerPage)}</span>
                </div>
                <button class="pagination-btn next">Next →</button>
            `;

            // Insert before newsletter
            if (newsletter) {
                blogSection.insertBefore(pagination, newsletter);
            } else {
                blogSection.appendChild(pagination);
            }

            // Bind events
            pagination.querySelector('.prev').addEventListener('click', () => this.prevPage());
            pagination.querySelector('.next').addEventListener('click', () => this.nextPage());
        },

        createCategoryFilter() {
            const blogSection = document.querySelector('.blog-page .container');
            const blogGrid = document.querySelector('.blog-page .blog-grid');

            // Extract categories
            const categories = new Set();
            this.blogCards.forEach(card => {
                const category = card.querySelector('.blog-category')?.textContent;
                if (category) categories.add(category);
            });

            const filter = document.createElement('div');
            filter.className = 'category-filter';
            filter.innerHTML = `
                <span class="filter-label">Filter by:</span>
                <button class="filter-btn active" data-category="all">All</button>
                ${Array.from(categories).map(cat =>
                `<button class="filter-btn" data-category="${cat}">${cat}</button>`
            ).join('')}
            `;

            // Insert before grid
            blogSection.insertBefore(filter, blogGrid);

            // Bind filter events
            filter.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    filter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterByCategory(btn.dataset.category);
                });
            });
        },

        filterByCategory(category) {
            this.blogCards.forEach(card => {
                const cardCategory = card.querySelector('.blog-category')?.textContent;
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });

            // Reset to page 1 and update
            this.currentPage = 1;
            const visibleCards = this.blogCards.filter(c => !c.classList.contains('filtered-out'));
            this.totalItems = visibleCards.length;
            this.updatePagination();
            this.showPage(1);
        },

        showPage(page) {
            this.currentPage = page;
            const visibleCards = this.blogCards.filter(c => !c.classList.contains('filtered-out'));
            const start = (page - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;

            visibleCards.forEach((card, index) => {
                if (index >= start && index < end) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '1';
                    }, index % this.itemsPerPage * 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Also hide filtered-out cards
            this.blogCards.filter(c => c.classList.contains('filtered-out')).forEach(card => {
                card.style.display = 'none';
            });

            this.updatePagination();

            // Scroll to top of blog section
            if (page > 1) {
                document.querySelector('.blog-page').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        updatePagination() {
            const visibleCards = this.blogCards.filter(c => !c.classList.contains('filtered-out'));
            const totalPages = Math.ceil(visibleCards.length / this.itemsPerPage);

            const pagination = document.querySelector('.pagination');
            if (!pagination) return;

            const prevBtn = pagination.querySelector('.prev');
            const nextBtn = pagination.querySelector('.next');
            const pageInfo = pagination.querySelector('.page-current');
            const totalInfo = pagination.querySelector('.page-total');

            prevBtn.disabled = this.currentPage <= 1;
            nextBtn.disabled = this.currentPage >= totalPages;
            pageInfo.textContent = this.currentPage;
            totalInfo.textContent = totalPages;

            // Hide pagination if only one page
            pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.showPage(this.currentPage - 1);
            }
        },

        nextPage() {
            const visibleCards = this.blogCards.filter(c => !c.classList.contains('filtered-out'));
            const totalPages = Math.ceil(visibleCards.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.showPage(this.currentPage + 1);
            }
        }
    };

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        /* Pagination Styles */
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin: 40px 0;
            padding: 20px;
        }

        .pagination-btn {
            background: var(--emerald-deep, #0d4d3d);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
            background: var(--champagne-gold, #d4af37);
            transform: translateY(-2px);
        }

        .pagination-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .pagination-info {
            font-weight: 600;
            color: var(--emerald-deep, #0d4d3d);
        }

        .page-current {
            color: var(--champagne-gold, #d4af37);
            font-size: 1.2em;
        }

        /* Category Filter Styles */
        .category-filter {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 30px;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid var(--gray-light, #e0e0e0);
        }

        .filter-label {
            font-weight: 600;
            color: var(--emerald-deep, #0d4d3d);
            margin-right: 10px;
        }

        .filter-btn {
            background: transparent;
            border: 2px solid var(--gray-light, #e0e0e0);
            padding: 8px 18px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            color: var(--gray-dark, #4a4a4a);
        }

        .filter-btn:hover {
            border-color: var(--champagne-gold, #d4af37);
            color: var(--champagne-gold, #d4af37);
        }

        .filter-btn.active {
            background: var(--champagne-gold, #d4af37);
            border-color: var(--champagne-gold, #d4af37);
            color: white;
        }

        /* Dark mode support */
        body.dark-mode .pagination-btn {
            background: #4CAF50;
        }

        body.dark-mode .filter-btn {
            border-color: #444;
            color: #ccc;
        }

        body.dark-mode .filter-btn.active {
            background: #d4af37;
            color: #000;
        }
    `;
    document.head.appendChild(style);

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        BlogPagination.init();
    });

})();
