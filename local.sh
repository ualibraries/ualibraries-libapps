#!/usr/bin/env bash

# Check for bash version, error if version too low
if ((BASH_VERSINFO[0] < 4)); then
  echo "Error: bash 4.0 or higher is required to run this script. If on MacOS, run: brew install bash"
  exit 1
fi

# Associative array for intuitive filenaming + date/time
declare -A PAGES
PAGES=(
  ["libcal-calendar"]="https://libcal.library.arizona.edu/calendar"
  ["libcal-calendar-cards"]="https://libcal.library.arizona.edu/calendar?cid=-1&t=g&d=0000-00-00&cal=-1&inc=0"
  ["libcal-spaces"]="https://libcal.library.arizona.edu/spaces"
  ["libguides-home"]="https://libguides.library.arizona.edu/library-guides"
  ["libguides-item"]="https://libguides.library.arizona.edu/american-indian-studies"
  ["libguides-az-database"]="https://libguides.library.arizona.edu/az/databases"
  ["libanswers-home"]="https://ask.library.arizona.edu/"
  ["libanswers-search"]="https://ask.library.arizona.edu/search"
  ["libanswers-item"]="https://ask.library.arizona.edu/ill_docdel_videostreaming/faq/303580"
)
OUTPUT_DIR="test"

# Ensure dir exits
mkdir -p "$OUTPUT_DIR"

# Loop through PAGES and wget each page
for FILENAME in "${!PAGES[@]}"; do
  wget "${PAGES[$FILENAME]}" -O "$OUTPUT_DIR/${FILENAME}-$(date +%Y%m%d-%H%M%S).html"
done
