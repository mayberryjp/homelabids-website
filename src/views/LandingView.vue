<template>
  <v-container fluid class="pa-0">
    <!-- Hero Section -->
    <v-row no-gutters class="hero-section primary">
      <v-col cols="12">
        <v-container class="py-12">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h1 class="text-h2 font-weight-bold white--text mb-4">
                BulgogiSando
              </h1>
              <p class="text-h5 white--text mb-8">
                Modern Network Management Platform
              </p>

              <div class="d-flex flex-wrap justify-center">
                <v-btn
                  color="secondary"
                  size="large"
                  class="ma-2"
                  rounded
                  to="/explore"
                >
                  Explore Features
                </v-btn>
                <v-btn
                  color="white"
                  size="large"
                  class="ma-2"
                  variant="outlined"
                  rounded
                  to="/auth/registration"
                >
                  Get Started
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>