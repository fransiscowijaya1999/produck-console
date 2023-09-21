<script>
    import axios from "axios";
    import Navigation from "$lib/Navigation.svelte";

    axios.defaults.baseURL = 'http://localhost:5000';
	axios.defaults.headers.post['Content-Type'] = 'application/json';
</script>

<Navigation />
<slot></slot>