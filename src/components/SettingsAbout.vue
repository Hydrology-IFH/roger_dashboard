<script setup>
  import packageInfo from '~/../package.json'; // Adjust the path as necessary
</script>

<template>
  <div>
    <h3>About</h3>
    <p>{{ packageInfo.description }}</p>
    <table class="table table-striped table-hover">
      <tbody>
        <tr>
          <th scope="row">Version</th>
          <td>{{ packageInfo.version }}</td>
        </tr>
        <tr>
          <th scope="row">Author</th>
          <td><a :href="`mailto:${packageInfo.author.email}`">{{ packageInfo.author.name }}</a></td>
        </tr>
        <tr>
          <th scope="row">License</th>
          <td>{{ packageInfo.license }}</td>
        </tr>
        <tr>
          <th scope="row">GitHub repository</th>
          <td><a :href="packageInfo.repository.url">{{ packageInfo.repository.url }}</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>