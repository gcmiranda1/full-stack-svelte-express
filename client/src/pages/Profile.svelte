<script>
    import axios from 'axios';
    import { user } from '../store';
    import { push } from 'svelte-spa-router';

    let oldPassword;
    let newPassword;

    let errorMessage;
    let successMessage;

    $: if (oldPassword) {
        errorMessage = null;
    }

    async function changePassword() {
        try {
            await axios.post("/api/auth/update-password", {
                oldPassword, 
                newPassword
            });
            successMessage = "Password was updated successfully"
        } catch (error) {
            if(error.response.data.message === 'IncorrectPasswordError') {
                oldPassword = ""
                newPassword = ""
                errorMessage = "Wrong old password"
            }
        }
    }

</script>

<div class="container">
    <div class="section">
        <h2 class="title">Change Password</h2>
        <hr />
        {#if successMessage}
            <div class="notification is-success">
                {successMessage}
            </div>
        {/if}
        <form on:submit|preventDefault={changePassword}>
            <div class="field">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">Old Password</label>
                <div class="control">
                    <input type="password" bind:value={oldPassword} class="input" required class:is-danger={errorMessage}/>
                    {#if successMessage} 
                        <p class="help is-success">{successMessage}</p>
                    {/if}
                </div>
            </div>
            <div class="field">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label">New Password</label>
                <div class="control">
                    <input type="password" bind:value={newPassword} class="input" required/>
                </div>
            </div>
            <div class="control">
                <input type="submit" class="button is-info is-light" value="Submit">
            </div>
        </form>
    </div>
</div>