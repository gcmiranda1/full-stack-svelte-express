<script>
    import axios from 'axios';
    import { user } from '../store';
    import { push } from 'svelte-spa-router';

    let username;
    let password;
    let errorMessage;

    $: if (username || password) {
        errorMessage = null;
    }

    async function signin() {
        try {
            const { data } = await axios.post("/api/auth/login", {
                username, 
                password
            });
            $user = data.user;
            push('/dashboard')
        } catch (error) {
            if(error.response.status === 403) {
                username = ""
                password = ""
                errorMessage = "Invalid Credentials"
            }
        }
    }

</script>

<div class="container">
    <div class="section">
        <h1 class="title">Sign in</h1>
        <hr />
        {#if errorMessage} 
            <p class="help is-danger">{errorMessage}</p>
        {/if}
        <form on:submit|preventDefault={signin}>
            <div class="field">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">Username</label>
                <div class="control">
                    <input type="text" bind:value={username} class="input" required class:is-danger={errorMessage}/>
                </div>
            </div>
            <div class="field">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">Password</label>
                <div class="control">
                    <input type="password" bind:value={password} class="input" required class:is-danger={errorMessage}/>
                </div>
            </div>
            <div class="control">
                <input type="submit" class="button is-info is-light" value="Submit">
            </div>
        </form>
        <hr />
        <p>
            Don't have a account?
            <a href="#/signup">Sign Up</a>
        </p>
        <hr />
    </div>
</div>