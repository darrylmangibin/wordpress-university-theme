<?php get_header(); ?>

<?php while(have_posts()) : the_post()?>
	<h2>This is a page</h2>
   <h1><?php the_title(); ?></h1>
    <?php the_content(); ?>
<?php endwhile; ?>

<?php get_footer(); ?>