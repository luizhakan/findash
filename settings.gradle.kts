pluginManagement {
	repositories {
		google()
		mavenCentral()
		gradlePluginPortal()
	}
	plugins {
		id("com.android.application") version "8.2.2"
		id("com.google.dagger.hilt.android") version "2.48"
		kotlin("android") version "1.9.22"
		kotlin("kapt") version "1.9.22"
	}
}

dependencyResolutionManagement {
	repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
	repositories {
		google()
		mavenCentral()
	}
}

include(":mobile")
project(":mobile").projectDir = File("apps/mobile")
