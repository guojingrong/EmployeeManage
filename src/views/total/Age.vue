<template>
    <div>

    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "agechart",
        data() {
            return {};
        },
        mounted() {

        },
        created() {
            this.init();
        },
        methods: {
            init() {
                axios({
                    method: "get",
                    url: this.$config.url.server + "/chart/age",
                    headers: {
                        // Authorization: "Bearer " + this.$confjs.token
                        "Content-Type": "application/json"
                    }
                })
                .then(res=>{
                    console.log(res)
                })
            }
        }
    }
</script>