<template>
  <div>
    <c-header />

    <div class="container-style" style="padding: 5vh;">
      <div style="width: 100%;">

        <div style="width: 50%; display: inline-block;">
          <p>Enter GitHub Username:</p>
          <input id="usernameField" placeholder="ben-vaughan"/>
          <button @click="updateRepos()">Find Repos</button>
        </div>

        <div style="width: 50%; display: inline-block;">
          <p> Select GitHub Repository: </p>
          <select id="repositoryField">
            <option v-for="repo in this.repositoryList" :key="repo.name">
              {{ repo.name }}
            </option>
          </select>
          <button @click="updateData()">Update Graph</button>
        </div>
      </div>
    </div>

    <div class="container-style" style="padding: 5vh">
      <canvas id="ghChart"></canvas>
    </div>
  </div>
</template>

<script>
import CHeader from "@/components/Header.vue";
const axios = require("axios");
const Chart = require("chart.js");

export default {
  name: "Dashboard",
  components: {
    CHeader,
  },

  data() {
    return {
      username: 'ben-vaughan',
      repositoryList: {},
      repository: '',
      commitList: [],
      commits: [],

      graphConfig: {
        type: 'line',
        tension: 0,
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [
            {
              label: 'GitHub Commits',
              borderColor: 'rgb(255, 99, 132)',
              spanGaps: true,
              tension: 0,
              borderWidth: 1,
              data: [0, 10, 5, 2, 20, 30, 28]
            }
          ]
        },
        options: {
          fill: false,
          borderColor: 'white',
          scales: {
            color: 'white'
          },
          spanGaps: true,
        }
      }
    }
  },

  mounted() {
    this.getUserRepos();
    const ghChart = document.getElementById('ghChart');
    new Chart(ghChart, this.graphConfig)
  },

  methods: {
    refreshGraph() {
      const ghChart = document.getElementById('ghChart');
      new Chart(ghChart, this.graphConfig)
    },

    updateRepos() {
      this.username = document.getElementById("usernameField").value;
      this.getUserRepos(this.username)
    },

    getUserRepos() {
      axios.get(`https://api.github.com/users/${ this.username }/repos`)
      .then((resp) => {
        console.log(`SUCCESSFULLY RETRIEVED ${ this.username }'S DATA...`)
        this.repositoryList = [];
        resp.data.forEach(repository => {
          this.repositoryList.push(repository);
          })
      })
      .catch((e) => {
        console.log(`ERROR RETRIEVING DATA.`);
        console.error(e);
      })
    },

    updateRepoList() {
      console.log(`UPDATING REPOSITORY SELECTION LIST...`)
      var repoList = document.getElementById('repositoriesSelect')
      repositoryList.forEach(repo =>
        repoList.add(repo.name)
      )
    },

    updateData() {
      this.repository = document.getElementById("repositoryField").value;

      axios.get(`https://api.github.com/repos/${ this.username }/${ this.repository }/commits`)
      .then((commits) => {

      let commitedDates = new Map();
      let commitHistory = [];

      commits.data.forEach(commit => {
        let commitDate = commit.commit.author.date.split('T')[0];
        if (commitedDates.has(commitDate)) {
          commitedDates.set(commitDate, commitedDates.get(commitDate) + 1);
        }
        else {
          commitedDates.set(commitDate, 1);
        }
      })

      commitedDates.forEach((v, k) => {
        commitHistory.push({ date: k, commits: v});
      });

      commitHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log(commitHistory);

      
      let firstCommit = commitHistory[0].date;
      let lastCommit = commitHistory[commitHistory.length - 1].date;

      let dateArray = [];
      let currentDate = new Date(firstCommit);
      let lastDate = new Date(lastCommit);

      while (currentDate <= lastDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      let commitArray = [];
      dateArray.forEach(date => {
        let commit = commitHistory.find((commit) => commit.date === date);
        if (commit) {
          commitArray.push(commit.commits);
        }
        else {
          commitArray.push({date, commits: 0});
        }
      })

      this.graphConfig.data.labels = dateArray;
      this.graphConfig.data.datasets[0].data = commitArray;

      this.refreshGraph();
      })
    },

  },
};


</script>

<style>
</style>