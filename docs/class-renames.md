# Homepage class renames (Client-First)

Rules: `section_[name]` for sections · `[component]_[element]` for custom classes · utilities use hyphens only · combo classes start with `is-`.

Webflow renames a class everywhere it is used, so the design doesn't change. Classes main.js selects (`course_item`, `t-btn`) stay as they are for now.

## Base classes


### Announcement bar

| Now | New |
|---|---|
| `Announce_Container` | `announcement_component` |
| `Announcement_Bar` | `announcement_bar` |
| `-space-` | `announcement_center` |
| `hidden_text` | `announcement_text` |
| `JS-Clock` | `countdown_component` |
| `Box` | `countdown_unit` |
| `Clock Number` | `countdown_number` |
| `Clock Label` | `countdown_label` |

### Navbar

| Now | New |
|---|---|
| `Navigation_v1` | `navbar_component` |
| `nav_container` | `navbar_container` |
| `account_split` | `navbar_account` |
| `progress_bar` | `navbar_progress-bar` |
| `Logo_icon` | `logo_icon` |
| `LOGO_TXT` | `logo_text` |

### Page

| Now | New |
|---|---|
| `SIDE_LINES` | `page_side-lines` |
| `CSS_container` | `page_css` |

### Hero

| Now | New |
|---|---|
| `HERO_SECTION` | `section_hero` |
| `50vh` | `hero_spacer` |
| `BG_container` | `hero_wrapper` |
| `bg_image` | `hero_background-image` |
| `DSF-tag-hidden` | `hero_tag-text` |
| `HERO_Bottom_sectin` | `hero_bottom` |
| `line_effect` | `line_component` |
| `blueline` | `line_blue` |
| `HERO_PRICE_title` | `price_heading` |
| `blue_line_cross` | `price_strike` |
| `save_txt` | `price_save` |
| `Superscript` | `price_superscript` |
| `REVIEWS_CONTENT` | `reviews_component` |
| `REVIEWS_text` | `reviews_label` |
| `Image_collection` | `reviews_avatars` |
| `heado` | `reviews_avatar` |

### Layout

| Now | New |
|---|---|
| `dividing_section` | `divider_horizontal` |
| `vertical_divider` | `divider_vertical` |

### Is this you

| Now | New |
|---|---|
| `IS_THIS_YOU` | `section_is-this-you` |
| `is-this-you-txt` | `is-this-you_content` |
| `is_this You` | `is-this-you_heading` |
| `DSF_list` | `is-this-you_list` |
| `DINOSAUR` | `dino_component` |
| `DINO--SECTION` | `dino_wrapper` |
| `dino` | `dino_icon` |
| `hourglass` | `dino_hourglass` |
| `Error_box` | `dino_errors` |
| `ERROR` | `dino_error` |
| `file_spacing` | `dino_files` |

### USP

| Now | New |
|---|---|
| `USP` | `section_usp` |
| `usp-paragraph` | `usp_paragraph` |

### Mac

| Now | New |
|---|---|
| `apple_space` | `section_mac` |
| `mac_OS_pop` | `mac_popup` |
| `pixel_apple` | `mac_apple-icon` |
| `Special_text` | `mac_text` |

### Outcome

| Now | New |
|---|---|
| `DREAM_OUTCOME` | `section_outcome` |
| `top_section` | `outcome_top` |
| `test_gif` | `outcome_gif` |
| `WG_txt` | `outcome_heading` |
| `WG_CONTAINER` | `outcome_container` |
| `WG_split` | `outcome_row` |
| `WG_item` | `outcome_item` |
| `WG_text` | `outcome_text` |
| `T_icon` | `outcome_title-wrap` |
| `WYWG_icon` | `outcome_icon` |
| `WCATC_title` | `outcome_title` |

### Testimonials

| Now | New |
|---|---|
| `TESTIMONIAL_SECTION` | `section_testimonials` |
| `Testionianl_container` | `testimonial_item` |
| `Mobile_tame_box` | `testimonial_mobile-header` |
| `quote_icon` | `testimonial_quote-icon` |
| `T_Name` | `testimonial_name` |
| `Testimonial_title` | `testimonial_quote` |
| `testimo_profile` | `testimonial_profile` |
| `proflie_shot` | `testimonial_profile-image` |
| `T_btn_container` | `testimonial_nav` |
| `t-btn-wrap` | `testimonial_nav-item` |
| `timer_bar_testimo` | `testimonial_timer` |
| `progress_bleu_bar` | `testimonial_timer-bar` |

### Money back

| Now | New |
|---|---|
| `MONEY_section` | `section_money-back` |
| `Money_back` | `money-back_component` |
| `Mony_box` | `money-back_content` |
| `moneyBack_txt` | `money-back_text` |
| `dfs_star` | `money-back_star` |

### CTA

| Now | New |
|---|---|
| `CTA_scroll` | `section_cta-scroll` |
| `FINAL_CTA` | `section_final-cta` |

### Course overview

| Now | New |
|---|---|
| `COURSE_OVERVIEW` | `section_course-overview` |
| `Section_BG_CO` | `course-overview_background` |
| `course_overview_txt` | `course-overview_header` |
| `Div Block 4` | `course-overview_meta` |
| `mono-text` | `text-style-mono` |
| `Index_container` | `course-overview_index` |
| `Ci_WRAP` | `ci_wrap` |
| `top-part-ch` | `course-item_top` |
| `bottom-part--ch` | `course-item_bottom` |
| `itm_nr` | `course-item_number` |
| `ch--nr` | `course-item_digit` |
| `Ch_title` | `course-item_title` |
| `ch -- context` | `course-item_text` |
| `top_folder_flap` | `course-item_flap` |
| `dimond` | `icon_diamond` |

### Chapters

| Now | New |
|---|---|
| `COURSE_CHAPTER` | `section_chapter` |
| `chap_content` | `chapter_content` |
| `Chapt_nr` | `chapter_number` |
| `title_chapter` | `chapter_title` |
| `paragraph` | `text-style-paragraph` |
| `modual_list` | `chapter_modules` |
| `modual_sub-title` | `chapter_module-title` |
| `course_list` | `chapter_module-list` |
| `course_list_item` | `chapter_module-item` |
| `File_storm` | `chapter_file-storm` |
| `files_svg` | `chapter_file-icon` |
| `Enrolled_` | `chapter_marquee-tag` |
| `MONO-Type` | `text-style-mono-body` |

### Tech stack

| Now | New |
|---|---|
| `Custom_container` | `tech-stack_container` |
| `Orbit_animation` | `tech-stack_orbit` |
| `Circle` | `tech-stack_circle` |
| `tech_icon` | `tech-stack_icon` |

### Instructor

| Now | New |
|---|---|
| `Rimb0_image_contained` | `instructor_component` |
| `Rimbo_img` | `instructor_image` |
| `rimbo_thingo` | `instructor_tag` |
| `rim-tag` | `instructor_tag-text` |
| `social_links` | `instructor_socials` |
| `Code Embed 5` | `instructor_social-icon` |
| `Your_intructor_animation` | `instructor_animation` |
| `instructor` | `instructor_ring` |
| `sircle_30rem` | `instructor_circle` |

### Power bar

| Now | New |
|---|---|
| `Power_bar_wrap` | `power-bar_component` |
| `Power_bar` | `power-bar_bar` |
| `POWER_BAR_TAG` | `power-bar_tag` |
| `E_BAR` | `e_bar` |
| `DFS_imp` | `power-bar_logo` |
| `Code Embed` | `power-bar_logo-icon` |

### FAQ & footer

| Now | New |
|---|---|
| `FAQ` | `section_faq` |
| `link` | `text-style-link-blue` |
| `Footer_minimal` | `footer_component` |
| `legal_links` | `footer_legal` |
| `Terms and Conditions` | `footer_legal-link` |

### Text

| Now | New |
|---|---|
| `Italic Text` | `hero_title-italic` |

## Combo classes

| On class | Now | New |
|---|---|---|
| `HERO_SECTION` | `is_100vh_test` | `is-fixed` |
| `MONO-Type` | `is_blue]` | `is-blue` |
| `MONO-Type` | `MID_PART` | `is-middle` |
| `JS-Clock` | `is-announcemnetbar` | `is-announcement` |
| `Box` | `v2` | `is-small` |
| `Clock Number` | `is-V2` | `is-small` |
| `Clock Label` | `is-V2` | `is-small` |
| `btn-animate-chars` | `SIGN_IN` | `is-sign-in` |
| `btn-animate-chars` | `MY_ACCOUNT` | `is-account` |
| `btn-animate-chars__bg` | `SIGN_IN` | `is-sign-in` |
| `split_grid` | `tablet_horizonatal` | `is-tablet-horizontal` |
| `split_section` | `isleft` | `is-left` |
| `split_section` | `is-dinosection` | `is-dino` |
| `dividing_section` | `is-midel` | `is-middle` |
| `dividing_section` | `is-mobile_only` | `is-mobile-only` |
| `dividing_section` | `is-one_line` | `is-single-line` |
| `container-large` | `5%padding?` | `is-padded` |
| `container-large` | `is-WG` | `is-outcome` |
| `course_item` | `right_Col` | `is-right` |
| `chap_content` | `TECH_STACK` | `is-tech-stack` |
| `chap_content` | `is_BIG` | `is-big` |
| `chap_content` | `is_center` | `is-center` |
| `chap_content` | `is-rimboS` | `is-rimbo-small` |
| `ch--nr` | `in-chapter` | `is-chapter` |
| `T_Name` | `MOBILE` | `is-mobile` |
| `paragraph` | `is-mobi` | `is-mobile` |
| `ERROR` | `IS-3` | `is-3` |
| `Special_text` | `2` | `is-2` |
| `Special_text` | `3` | `is-3` |
| `Special_text` | `5` | `is-5` |
| `sircle_30rem` | `2` | `is-2` |
| `Power_bar_wrap` | `is-bar2` | `is-2` |
| `marquee-css` | `100%` | `is-full-width` |
| `marquee-css` | `is-CTA` | `is-cta` |
| `marquee-css` | `is_mission` | `is-mission` |
| `marquee-css__item` | `is-stay_clean` | `is-stay-clean` |
| `tech_icon` | `is-claud` | `is-claude` |
| `tech_icon` | `is-toggel` | `is-toggl` |

## Kept as they are

- `page-wrapper`
- `main-wrapper`
- `padding-global`
- `container-large`
- `container-medium`
- `margin-bottom`
- `margin-top`
- `heading-style-h2`
- `heading-style-h4`
- `text-style-link`
- `display-inlineflex`
- (Client-First utilities — already correct)
- `accordion-css*`
- `btn-animate-chars*`
- `btn-icon-content*`
- `marquee-css*`
- `parallax-*`
- (Osmo components — keep their documented names, their CSS depends on them)
- `course_item`
- `t-btn`
- (main.js selects these — rename later together with the code)
- `hero_content`
- `hero_tag`
- `hero_title`
- `split_grid`
- `split_section`
- `usp_content`
- `grid-background`
- `logo_link`
- (already Client-First style)
