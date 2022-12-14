export function observerMixin(type) {
    if (type === 'movies') {
        return {
            mounted() {
                setTimeout(() => {
                    const observer = new IntersectionObserver(async (entries) => {
                        if (
                            entries[0].isIntersecting &&
                            this.currentPage !== this.movies.total_pages
                        ) {
                            if (this.movies.total_pages === 1) {
                                return;
                            }
                            if (this.selectedSearchQuery && this.currentPage !== this.movies.page) {
                                this.currentPage = 1;
                            }
                            this.currentPage += 1;
                            await this.getNextMoviesPage({
                                page: this.currentPage,
                                query: this.selectedSearchQuery,
                                genres: this.selectedGenres,
                                chosenLeftRatingVote: this.leftRatingRangeValue,
                                chosenRightRatingVote: this.rightRatingRangeValue,
                                chosenLeftReleaseDateVote: this.leftYearRangeValue,
                                chosenRightReleaseDateVote: this.rightYearRangeValue,
                                selectedValue: this.selectedValue,
                            });
                            this.compareTotalResults();
                        }
                    }, {});
                    observer.observe(this.$refs.observer);
                }, 1000);
            },
        }
    } else if (type === 'actors') {
        return {
            mounted() {
                if (this.big) {
                    setTimeout(() => {
                        const observer = new IntersectionObserver(async (entries) => {
                            if (
                                entries[0].isIntersecting &&
                                this.currentPage !== this.actors.total_pages
                            ) {
                                if (this.actors.total_pages === 1) {
                                    return;
                                }
                                if (this.searchQuery && this.currentPage !== this.actors.page) {
                                    this.currentPage = 1;
                                }
                                this.currentPage += 1;
                                await this.getNextActorPage({
                                    page: this.currentPage,
                                    query: this.searchQuery,
                                });
                                this.compareTotalResults();
                            }
                        }, {});
                        observer.observe(this.$refs.observer);
                    }, 1000);
                }
            },
        }
    } else if (type === 'tvs') {
        return {
            mounted() {
                setTimeout(() => {
                    const observer = new IntersectionObserver(async (entries) => {
                        if (
                            entries[0].isIntersecting &&
                            this.currentPage !== this.tvs.total_pages
                        ) {
                            if (this.tvs.total_pages === 1) {
                                return;
                            }
                            if (this.selectedSearchQuery && this.currentPage !== this.tvs.page) {
                                this.currentPage = 1;
                            }
                            this.currentPage += 1;
                            await this.getNextTvPage({
                                page: this.currentPage,
                                query: this.selectedSearchQuery,
                            });
                            this.compareTotalResults();
                        }
                    }, {});
                    observer.observe(this.$refs.observer);
                }, 1000);
            },
        }
    }
}
