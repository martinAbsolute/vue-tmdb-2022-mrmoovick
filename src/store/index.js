import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import uniqby from "lodash.uniqby";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        searchQuery: "",
        selectedSearchQuery: "",
        leftRatingRangeValue: "0",
        rightRatingRangeValue: "10",
        leftYearRangeValue: "1895",
        rightYearRangeValue: "2022",
        selectedValue: null,
        isLoading: false,
        isSearchModalVisible: false,
        isShown: false,
        isDiscovery: false,
        movies: [],
        actors: [],
        actorKnownFor: [],
        tvs: [],
        uniqueMovies: [],
        uniqueActors: [],
        uniqueTvs: [],
        selectedGenres: [],
        searchResults: [],
        movieDetails: {},
        actorDetails: {},
        tvDetails: {},
        seasonDetails: {},
    },
    getters: {
        uniqueMovies: ({uniqueMovies, movies}) => {
            uniqueMovies = uniqby(movies.results, "id");
            return uniqueMovies;
        },
        uniqueActors: ({uniqueActors, actors}) => {
            uniqueActors = uniqby(actors.results, "id");
            return uniqueActors;
        },
        uniqueTvs: ({uniqueTvs, tvs}) => {
            uniqueTvs = uniqby(tvs.results, "id");
            return uniqueTvs;
        },
        sortedTypes: (state) => {
            let obj = {
                movies: [],
                tvs: [],
                actors: [],
            };
            state.searchResults.results
                ? state.searchResults.results.forEach((el) => {
                    if (el.media_type === "person" && obj.actors.length !== 5) {
                        obj.actors.push(el);
                    } else if (el.media_type === "tv" && obj.tvs.length !== 5) {
                        obj.tvs.push(el);
                    } else if (el.media_type === "movie" && obj.movies.length !== 5) {
                        obj.movies.push(el);
                    }
                })
                : (obj = 0);
            return obj;
        },
    },
    mutations: {
        GET_MOVIES(state, movies) {
            state.selectedGenres = [];
            state.actorDetails = {};
            state.movieDetails = {};
            state.movies = {};
            state.searchQuery = "";
            state.selectedSearchQuery = "";
            state.movies = movies;
        },
        SET_ACTORS(state, actors) {
            if (actors.e) {
                state.actors = {results: []};
            } else {
                state.actors = {results: [...actors]};
            }
        },
        SET_TVS(state, tvs) {
            state.tvs = {...tvs};
        },
        SET_SEARCH_QUERY(state, payload) {
            state.searchQuery = payload;
        },
        SET_MULTI_SEARCH_MOVIES(state, {response, query}) {
            state.searchResults = [];
            state.searchResults = {...response};
            state.searchQuery = query;
            state.selectedSearchQuery = query;
        },
        SET_SEARCH_MOVIES(state, {response, query}) {
            state.movies = [];
            state.searchResults = [];
            state.searchQuery = "";
            state.selectedSearchQuery = query;
            state.movies = response;
        },
        SET_SEARCH_ACTORS(state, {response}) {
            state.actors = {};
            state.searchResults = [];
            state.actors = response;
        },
        SET_SEARCH_TVS(state, {response}) {
            state.tvs = {};
            state.selectedSearchQuery = state.searchQuery;
            state.searchQuery = "";
            state.searchResults = [];
            state.tvs = response;
        },
        SET_MOVIE_DETAILS(state, movie) {
            state.tvDetails = {};
            state.movieDetails = {};
            state.movieDetails = movie;
        },
        SET_ACTOR_DETAILS(state, actor) {
            state.actorDetails = {};
            state.tvDetails = {};
            state.movieDetails = {};
            state.actorDetails = actor;
        },
        SET_ACTOR_KNOWN_FOR(state, array) {
            state.actorKnownFor = [];
            state.actorKnownFor = array;
        },
        SET_TV_DETAILS(state, tv) {
            state.actorDetails = {};
            state.tvDetails = {};
            state.movieDetails = {};
            state.tvDetails = tv;
        },
        SET_SEASON_DETAILS(state, season) {
            state.actorDetails = {};
            state.tvDetails = {};
            state.movieDetails = {};
            state.seasonDetails = {};
            state.seasonDetails = season;
        },
        NEXT_MOVIES_PAGE(state, response) {
            state.movies.results = [...state.movies.results, ...response.results];
            state.movies.page = response.page;
        },
        NEXT_ACTOR_PAGE(state, response) {
            state.actors.results = [...state.actors.results, ...response.results];
            state.actors.page = response.page;
        },
        NEXT_TV_PAGE(state, response) {
            state.tvs.results = [...state.tvs.results, ...response.results];
            state.tvs.page = response.page;
        },
        FILTER_MOVIE_PAGE(state, movies) {
            state.movies = {};
            state.actorDetails = {};
            state.movieDetails = {};
            state.movies = movies;
        },
        clearMovieDetails(state) {
            state.movieDetails = {};
        },
        changeSearchModalVisible(state, payload) {
            state.isSearchModalVisible = payload;
        },
        changeLeftVoteRating(state, payload) {
            state.leftRatingRangeValue = payload;
        },
        changeRightVoteRating(state, payload) {
            state.rightRatingRangeValue = payload;
        },
        changeLeftYearRating(state, payload) {
            state.leftYearRangeValue = payload;
        },
        changeRightYearRating(state, payload) {
            state.rightYearRangeValue = payload;
        },
        clearFilters(state) {
            state.selectedGenres = [];
            state.selectedValue = null;
            state.leftYearRangeValue = "1895";
            state.rightYearRangeValue = "2022";
            state.leftRatingRangeValue = "0";
            state.rightRatingRangeValue = "10";
        },
        clearSelectedQuery(state) {
            state.selectedSearchQuery = "";
        },
        changeSelectValue(state, payload) {
            state.selectedValue = payload;
        },
        changeIsDiscovery(state, payload) {
            state.isDiscovery = payload;
        },
        SET_IS_LOADING(state, payload) {
            state.isLoading = payload;
        },
        SET_SHOW(state, payload) {
            state.isShown = payload;
        },
        PUSH_GENRE(state, payload) {
            state.selectedGenres.push(payload);
        },
        REMOVE_GENRE(state, payload) {
            state.selectedGenres.splice(payload, 1);
        },
    },
    actions: {
        async getMovies({commit}) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                commit("SET_IS_LOADING", true);
                const {data} = await axios.get(
                    "https://api.themoviedb.org/3/discover/movie",
                    options
                );
                commit("GET_MOVIES", data);
            } catch (e) {
                alert(e);
            } finally {
                commit("SET_IS_LOADING", false);
            }
        },
        async getActorKnownFor({commit}, query) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, query, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/search/person`,
                    options
                );
                commit("SET_ACTOR_KNOWN_FOR", data.results[0].known_for);
            } catch (e) {
                alert(e);
            }
        },
        async getMovieActors({commit}, movieId) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    options
                );
                commit("SET_ACTORS", data.cast);
            } catch (e) {
                commit("SET_ACTORS", {e: e});
            }
        },
        async getTvActors({commit}, tvId) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/tv/${tvId}/credits`,
                    options
                );
                commit("SET_ACTORS", data.cast);
            } catch (e) {
                commit("SET_ACTORS", {e: e});
            }
        },
        async getTvs({commit}, tvId) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/tv/${tvId}`,
                    options
                );
                commit("SET_TVS", data);
            } catch (e) {
                alert(e);
            }
        },
        async multiSearch({commit}, query) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    query,
                    language: "en",
                },
            };
            try {
                if (query) {
                    commit("SET_SHOW", true);
                    const {data} = await axios.get(
                        `https://api.themoviedb.org/3/search/multi`,
                        options
                    );
                    commit("SET_MULTI_SEARCH_MOVIES", {response: data, query});
                } else {
                    commit("SET_SHOW", true);
                    return;
                }
            } catch (e) {
                alert(e);
            } finally {
                commit("SET_SHOW", false);
            }
        },
        async movieSearch({commit}, query) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    query,
                    language: "en",
                },
            };
            try {
                commit("SET_IS_LOADING", true);
                if (query) {
                    const {data} = await axios.get(
                        `https://api.themoviedb.org/3/search/movie`,
                        options
                    );
                    commit("SET_SEARCH_MOVIES", {response: data, query});
                } else {
                    return;
                }
            } catch (e) {
                alert(e);
            } finally {
                commit("SET_IS_LOADING", false);
            }
        },
        async actorSearch({commit}, query) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    query,
                    language: "en",
                },
            };
            try {
                commit("SET_IS_LOADING", true);
                if (query) {
                    const {data} = await axios.get(
                        `https://api.themoviedb.org/3/search/person`,
                        options
                    );
                    commit("SET_SEARCH_ACTORS", {response: data});
                } else {
                    return;
                }
            } catch (e) {
                alert(e);
            } finally {
                commit("SET_IS_LOADING", false);
            }
        },
        async tvSearch({commit}, query) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    query,
                    language: "en",
                },
            };
            try {
                commit("SET_IS_LOADING", true);
                if (query) {
                    const {data} = await axios.get(
                        `https://api.themoviedb.org/3/search/tv`,
                        options
                    );
                    commit("SET_SEARCH_TVS", {response: data});
                } else {
                    return;
                }
            } catch (e) {
                alert(e);
            } finally {
                commit("SET_IS_LOADING", false);
            }
        },
        async getMovieDetails({commit}, movieId) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };

            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}`,
                    options
                );
                commit("SET_MOVIE_DETAILS", data);
            } catch (e) {
                alert(e);
            }
        },
        async getActorDetails({commit}, actorId) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/person/${actorId}`,
                    options
                );
                commit("SET_ACTOR_DETAILS", data);
            } catch (e) {
                alert(e);
            }
        },
        async getTvDetails({commit}, tvId) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/tv/${tvId}`,
                    options
                );
                commit("SET_TV_DETAILS", data);
            } catch (e) {
                alert(e);
            }
        },
        async getSeasonDetails({commit}, {tvId, seasonNumber}) {
            const options = {
                params: {api_key: process.env.VUE_APP_API_KEY, language: "en"},
            };
            try {
                const {data} = await axios.get(
                    `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`,
                    options
                );
                commit("SET_SEASON_DETAILS", data);
            } catch (e) {
                alert(e);
            }
        },
        async getNextMoviesPage(
            {commit},
            {
                page,
                query,
                genres,
                chosenLeftRatingVote,
                chosenRightRatingVote,
                chosenLeftReleaseDateVote,
                chosenRightReleaseDateVote,
                selectedValue,
            }
        ) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    language: "en",
                    page,
                    query,
                    with_genres: encodeURI(genres.join(",")),
                    sort_by: selectedValue,
                    ["vote_average.gte"]: chosenLeftRatingVote,
                    ["vote_average.lte"]: chosenRightRatingVote,
                    ["release_date.gte"]: chosenLeftReleaseDateVote,
                    ["release_date.lte"]: chosenRightReleaseDateVote,
                },
            };
            if (query) {
                try {
                    const {data} = await axios.get(
                        "https://api.themoviedb.org/3/search/movie",
                        options
                    );
                    commit("NEXT_MOVIES_PAGE", data);
                } catch (e) {
                    alert(e);
                }
            } else {
                try {
                    const {data} = await axios.get(
                        "https://api.themoviedb.org/3/discover/movie",
                        options
                    );
                    commit("NEXT_MOVIES_PAGE", data);
                } catch (e) {
                    alert(e);
                }
            }
        },
        async getNextActorPage({commit}, {page, query}) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    query,
                    language: "en",
                    page,
                },
            };
            try {
                const {data} = await axios.get(
                    "https://api.themoviedb.org/3/search/person",
                    options
                );
                commit("NEXT_ACTOR_PAGE", data);
            } catch (e) {
                return;
            }
        },
        async getNextTvPage({commit}, {page, query}) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    query,
                    language: "en",
                    page,
                },
            };
            try {
                const {data} = await axios.get(
                    "https://api.themoviedb.org/3/search/tv",
                    options
                );
                commit("NEXT_TV_PAGE", data);
            } catch (e) {
                alert(e);
            }
        },
        async getFilter(
            {commit},
            {
                withGenres,
                chosenLeftRatingVote,
                chosenRightRatingVote,
                chosenLeftReleaseDateVote,
                chosenRightReleaseDateVote,
                selectedValue,
            }
        ) {
            const options = {
                params: {
                    api_key: process.env.VUE_APP_API_KEY,
                    with_genres: withGenres ? encodeURI(withGenres.join(",")) : "",
                    language: "en",
                    sort_by: selectedValue,
                    ["vote_average.gte"]: chosenLeftRatingVote,
                    ["vote_average.lte"]: chosenRightRatingVote,
                    ["release_date.gte"]: chosenLeftReleaseDateVote,
                    ["release_date.lte"]: chosenRightReleaseDateVote,
                },
            };
            try {
                const {data} = await axios.get(
                    "https://api.themoviedb.org/3/discover/movie",
                    options
                );
                commit("FILTER_MOVIE_PAGE", data);
            } catch (e) {
                alert(e);
            }
        },
    },

    modules: {},
});
