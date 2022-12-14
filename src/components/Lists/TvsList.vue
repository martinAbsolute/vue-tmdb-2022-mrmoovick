<template>
  <div>
    <div
        class="d-flex flex-column justify-content-center align-items-end container mt-3"
        v-if="!isLoading"
    >
      <div class="d-flex flex-row">
        <b-list-group horizontal class="flex-sm-wrap">
          <b-list-group-item
              class="tv-list w-auto m-2 p-0 border-0 d-flex justify-content-center align-items-start rounded-circle card"
              v-for="{
              name,
              backdrop_path,
              overview,
              original_name,
              first_air_date,
              vote_average,
              id,
            } in uniqueTvs"
              :key="id"
          >
            <tv-card
                :name="name"
                :backdropPath="backdrop_path || ''"
                :overview="overview"
                :originalName="original_name"
                :firstAirDate="first_air_date || ''"
                :overallRating="vote_average"
                :tvId="id"
                @get-tv-card-id="getChosenTvDetails"
            >
            </tv-card>
          </b-list-group-item>
        </b-list-group>
        <modal-window :genres="filteredGenres"/>
      </div>
    </div>
    <div class="spinner" v-else>
      <b-spinner/>
    </div>
    <div ref="observer" style="border: 1px solid #9ad4d6"></div>
  </div>
</template>

<script>
import ModalWindow from "@/components/Interactive/TvModalWindow";

import {mapActions, mapGetters, mapState} from "vuex";
import TvCard from "@/components/Cards/TvCard";
import {observerMixin} from "@/mixins/observerMixin";

export default {
  name: "TvsList",
  components: {TvCard, ModalWindow},
  mixins: [observerMixin("tvs")],
  data: () => ({
    totalResults: 0,
    currentPage: 1,
  }),
  methods: {
    compareTotalResults() {
      if (this.tvs.total_results > 10000) {
        this.totalResults = 10000;
      } else {
        this.totalResults = this.tvs.total_results;
      }
    },
    async getChosenTvDetails(tv) {
      await this.getTvDetails(tv);
    },
    ...mapActions(["getTvDetails", "getNextTvPage"]),
  },
  computed: {
    filteredGenres() {
      const unFilteredGenres = this.tvDetails.genres
          ? this.tvDetails.genres.map((el) => el.name)
          : [];
      return unFilteredGenres.length > 3
          ? unFilteredGenres.slice(0, 3).join(", ") + "..."
          : unFilteredGenres.join(", ");
    },
    ...mapGetters(["uniqueTvs"]),
    ...mapState([
      "tvDetails",
      "tvs",
      "searchQuery",
      "isLoading",
      "selectedSearchQuery",
    ]),
  },
};
</script>

<style scoped>
.card {
  border-radius: 20px;
}

.container {
  max-width: 1160px;
}

.spinner {
  height: 888px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
