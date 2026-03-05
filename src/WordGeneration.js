import React, { useEffect, useState } from "react";

export async function Word() {
  try {
    const res = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await res.json();
    return data[0].toUpperCase();
  } catch (err) {
    console.error("Word fetch failed:", err);
    return "DEFAULTWORD"; // fallback
  }
}

export default Word;
