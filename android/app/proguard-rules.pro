# ProGuard rules for Moon Fitness OS
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.moon.fitness.** { *; }
