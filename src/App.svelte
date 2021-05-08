<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
</script>

<Router {routes} />

<style global>
  html {
    --black: DarkSlateGray;
    --gray: Tan;
    --white: PapayaWhip;
  }

  html,
  body {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 1rem;
    box-sizing: border-box;
    background-color: var(--white);
    color: var(--black);
    font-family: "Trebuchet MS", sans-serif;
  }
</style>
