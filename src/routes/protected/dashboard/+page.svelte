<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;
</script>

<div class="container bg-light rounded mt-5">
  <div class="row p-5">
    <h1 class="display-4">Calorie Goal: {data.calorieGoal} cal</h1>
    <h1 class="display-4">
      Remaining: {data.calorieGoal + data.calorieWorkout - data.calorieMeal} cal
    </h1>
  </div>
</div>

<div class="container bg-light rounded mt-5">
  <div class="row p-5">
    <h1 class="display-3">Workouts</h1>

    {#if data.workouts.length != 0}
      <ol class="list-group">
        {#each data.workouts as workout}
          <div class="row mb-2">
            <li
              class="rounded list-group-item d-flex justify-content-between align-items-start bg-accent"
            >
              <form method="post" action="?/delete" class="me-3">
                <input type="hidden" name="inputId" value="{workout.id}" />
                <input type="hidden" name="table" value="workout" />
                <button type="submit" class="py-3 px-4 btn btn-danger btn-input"
                  >X</button
                >
              </form>
              <div class="ms-2 me-auto">
                <div class="fw-bold">{workout.name}</div>
                <small>{workout.weight} lbs</small>
              </div>
              <span class="badge bg-dark rounded-pill"
                >{workout.calories} cals</span
              >
            </li>
          </div>
        {/each}
      </ol>
      <hr />
      <p class="lead">
        Total Calories burned: <mark>{data.calorieWorkout}</mark>
      </p>
    {:else}
      <div class="text-center">
        <p class="lead">You have no workouts logged</p>
        <a class="btn btn-lg btn-light" href="/protected/workout">Log Now</a>
      </div>
    {/if}
  </div>
  <hr />
  <div class="row p-5">
    <h1 class="display-3">Meals</h1>

    {#if data.meals.length != 0}
      <ol class="list-group">
        {#each data.meals as meal}
          <div class="row mb-2">
            <li
              class="rounded list-group-item d-flex justify-content-between align-items-start bg-primary"
            >
              <form method="post" action="?/delete" class="me-3">
                <input type="hidden" name="inputId" value="{meal.id}" />
                <input type="hidden" name="table" value="meal" />
                <button type="submit" class="py-3 px-4 btn btn-danger btn-input"
                  >X</button
                >
              </form>
              <div class="ms-2 me-auto">
                <div class="fw-bold">{meal.name}</div>
                <small>{meal.time}</small>
              </div>
              <span class="badge bg-light rounded-pill"
                >{meal.calories} cals</span
              >
            </li>
          </div>
        {/each}
      </ol>
      <hr />
      <p class="lead">
        Total Calories consumed: <mark>{data.calorieMeal}</mark>
      </p>
    {:else}
      <div class="text-center">
        <p class="lead">You have no meals logged</p>
        <a class="btn btn-lg btn-light" href="/protected/meals">Log Now</a>
      </div>
    {/if}
  </div>
</div>

<div
  class="container text-center d-flex justify-content-center p-5 my-5 bg-light rounded"
>
  <div class="row">
    <h1 class="display-3">
      <div class="icon baseline">
        <svg
          fill="#000000"
          width="800px"
          height="800px"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>user-profile-card</title>
          <path
            d="M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-20q-2.496 0-4.256 1.76t-1.76 4.256v20zM4 24v-17.984q0-0.832 0.576-1.408t1.44-0.608h20q0.8 0 1.408 0.608t0.576 1.408v17.984h-24zM10.016 19.008q0 1.248 0.864 2.144t2.112 0.864h6.016q1.248 0 2.112-0.864t0.896-2.144q-0.256-1.344-1.088-2.464t-2.048-1.792q1.12-1.152 1.12-2.752v-1.984q0-1.664-1.184-2.848t-2.816-1.152-2.816 1.152-1.184 2.848v1.984q0 1.6 1.12 2.752-1.216 0.672-2.048 1.792t-1.056 2.464zM12 19.008q0.352-1.28 1.472-2.144t2.528-0.864 2.528 0.864 1.472 2.144q0 0.416-0.288 0.704t-0.704 0.288h-6.016q-0.384 0-0.704-0.288t-0.288-0.704zM14.016 12v-1.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v1.984q0 0.832-0.608 1.44t-1.408 0.576-1.408-0.576-0.576-1.44z"
          ></path>
        </svg>
      </div>
      Profile
    </h1>
    <p class="lead">User id: {data.userId}</p>
    <p class="lead">Username: {data.username}</p>
    <form method="post" action="?/logout" use:enhance>
      <button type="submit" class="btn btn-lg btn-danger"> Sign Out</button>
      <a href="/protected" class="btn btn-lg btn-dark">Back</a>
    </form>
  </div>
</div>
