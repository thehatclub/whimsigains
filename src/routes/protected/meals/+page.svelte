<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";

  export let data: PageData;

  const { form, errors, enhance, message } = superForm(data.form);
</script>

<main>
  <div class="container bg-primary rounded p-5 my-5">
    <div class="d-flex justify-content-between align-items-center text-light">
      <h1 class="display-3">
        <div class="icon baseline">
          <svg
            fill="#000000"
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M22.742,9.645l-.008-.021A11,11,0,0,0,1.056,10.9h0A11,11,0,1,0,22.746,9.67ZM12,3a9.009,9.009,0,0,1,8.653,6.553,5.748,5.748,0,0,1-3.743,1.56A4.988,4.988,0,0,0,7.878,9.179a9.144,9.144,0,0,0-4.438.052A9.014,9.014,0,0,1,12,3ZM9.292,10.733A2.993,2.993,0,0,1,15,12c0,.022-.006.042-.006.063l0,.019a2.995,2.995,0,1,1-5.7-1.349Zm11.032,4.679-.429-.859a1,1,0,0,0-1.79.894l1,2c.006.011.015.019.021.029a9,9,0,0,1-5.169,3.3c-.119-.519-.366-.529-1.25-1.486a1,1,0,0,0-1.414,1.414l.271.271a9.006,9.006,0,0,1-7.789-5.339l.932-.932a1,1,0,0,0-1.414-1.414l-.164.164a7.527,7.527,0,0,1-.107-1.893,5.822,5.822,0,0,1,4.069-.5A4.78,4.78,0,0,0,7,12a5.006,5.006,0,0,0,5,5,5.272,5.272,0,0,0,2.536-.692l.569,1.139a1,1,0,1,0,1.79-.894l-.831-1.661.008-.01a4.867,4.867,0,0,0,.794-1.76,7.836,7.836,0,0,0,4.126-1.289c0,.056.008.111.008.167A8.95,8.95,0,0,1,20.324,15.412ZM8.707,17.293a1,1,0,1,1-1.414,1.414l-1-1a1,1,0,0,1,1.414-1.414Z"
            ></path></svg
          >
        </div>
        Meals
      </h1>
      <a href="/protected" class="btn btn-lg btn-dark">Back</a>
    </div>
    <hr />
    {#if $message}
      <div
        class="alert"
        class:alert-success="{$page.status == 200}"
        class:alert-danger="{$page.status >= 400}"
        role="alert"
      >
        {$message}
      </div>
    {/if}

    <div class="text-center">
      <form method="post" use:enhance class="text-start">
        <div class="mb-3">
          <label for="date" class="form-label">Enter Meal Date:</label>
          <input
            type="date"
            name="date"
            class="form-control"
            bind:value="{$form.date}"
          />
          {#if $errors.date}
            <small class="text-danger">{$errors.date}</small>
            <br />
          {/if}
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">Enter Meal Name:</label>
          <input
            type="text"
            name="name"
            class="form-control"
            bind:value="{$form.name}"
          />
          {#if $errors.name}
            <small class="text-danger">{$errors.name}</small>
            <br />
          {/if}
        </div>
        <div class="mb-3">
          <label for="calories" class="form-label">Enter Meal Calories:</label>
          <input
            type="number"
            name="calories"
            class="form-control"
            bind:value="{$form.calories}"
          />
          {#if $errors.calories}
            <small class="text-danger">{$errors.calories}</small>
            <br />
          {/if}
        </div>
        <div class="mb-3">
          <label for="meal_time" class="form-label"
            >Choose your Meal of the day:</label
          >
          <select
            name="meal_time"
            class="form-control"
            bind:value="{$form.meal_time}"
          >
            <option></option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          {#if $errors.meal_time}
            <small class="text-danger">{$errors.meal_time}</small>
            <br />
          {/if}
        </div>
        <div class="mb-3 text-center">
          <input type="submit" class="btn btn-lg btn-light" />
        </div>
      </form>
    </div>
  </div>
</main>
