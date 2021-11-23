import { Line } from 'vue-chartjs';

export default {
    extends: Line,
    props: ['chartdata', 'options'],
    mounted () {
        this.renderChart(data, options);
    }
}