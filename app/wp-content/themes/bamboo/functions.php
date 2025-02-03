<?php

// App security
require_once get_template_directory() . '/functions/security.php';

// Load WP tweaks
require_once get_template_directory() . '/functions/tweaks.php';

// Load scripts & css styles
require_once get_template_directory() . '/functions/scripts.php';

// Customize theme
require_once get_template_directory() . '/functions/customize.php';

// Custom post types
require_once get_template_directory() . '/functions/post-types.php';

// Custom images
require_once get_template_directory() . '/functions/images.php';

// Customize GraphQL
require_once get_template_directory() . '/functions/graphql.php';

/* CLASSES */

// Tools
require_once get_template_directory() . '/core/WingsTools.php';

// REST
require_once get_template_directory() . '/core/WingsRestController.php';

// Token
require_once get_template_directory() . '/core/WingsToken.php';

// Forms
require_once get_template_directory() . '/core/WingsForms.php';

// Validation
require_once get_template_directory() . '/core/WingsValidator.php';

// User
require_once get_template_directory() . '/core/WingsUser.php';

// Promotions
require_once get_template_directory() . '/core/WingsPromo.php';

// Payment
require_once get_template_directory() . '/core/WingsPayment.php';

// Shop
require_once get_template_directory() . '/core/WingsShop.php';

// Projects
require_once get_template_directory() . '/core/WingsProject.php';