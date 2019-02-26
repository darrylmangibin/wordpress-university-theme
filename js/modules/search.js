(function($) {
	class Search {
		// 1. describe and create/initiate object
		constructor() {
			this.addSearchHTML();
			this.openButton = $('.js-search-trigger');
			this.closeButton = $('.search-overlay__close');
			this.searchOverlay = $('.search-overlay');
			this.searchField = $('#search-term');
			this.resultsDiv = $('#search-overlay__results');
			this.events();
			this.isOverlayOpen = false;
			this.typingTimer;
			this.isSpinnerVisible = false;
			this.previousValue;
		}

		
		events() {
			this.openButton.on('click', this.openOverlay.bind(this));
			this.closeButton.on('click', this.closeOverlay.bind(this));
			$(document).on('keyup', this.keyPressDispatcher.bind(this));
			this.searchField.on('keyup', this.typingLogic.bind(this));
		}

		typingLogic() {
			if(this.searchField.val() !== this.previousValue) {
				clearTimeout(this.typingTimer);
				if(this.searchField.val()) {
					if(!this.isSpinnerVisible) {
						this.resultsDiv.html('<div class="spinner-loader"></div>');
						this.isSpinnerVisible = true;
					}
					this.typingTimer = setTimeout(this.getResults.bind(this), 750);
				} else {
					this.resultsDiv.html('');
					this.isSpinnerVisible = false;
				}
			}

			this.previousValue = this.searchField.val();
		}

		getResults() {
			$.when(
				$.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val()), 
				$.getJSON(universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val())
			)
			.then((posts, pages) => {
				var combinedResults = posts[0].concat(pages[0])
					this.resultsDiv.html(`
					<h2 class="search-overlay__section-title">General Information</h2>
					${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No general Information matches that search</p>' }
					
					${combinedResults.map((item) => {
						return `<li><a href="${item.link}">${item.title.rendered}</a></li>`
					}).join('')}
					${combinedResults.length ? '</ul>' : ''}
					`);
				this.isSpinnerVisible = false;
			}, () => {
				this.resultsDiv.html('<p>Unexpected Error; Please try again</p>')
			});
		}
		
		openOverlay() {
			this.searchOverlay.addClass('search-overlay--active');
			$('body').addClass('body-no-scroll');
			this.searchField.val('');
			setTimeout(() => {
				this.searchField.focus();
			}, 301);
			this.isOverlayOpen = true;

		}

		closeOverlay() {
			this.searchOverlay.removeClass('search-overlay--active');
			$('body').removeClass('body-no-scroll');

			this.isOverlayOpen = false;

		}

		keyPressDispatcher(e) {
			if (e.keyCode === 83 && !this.isOverlayOpen && !$('input, textarea').is(':focus')) {
				this.openOverlay();
			}

			if (e.keyCode === 27 && this.isOverlayOpen) {
				this.closeOverlay();
			}
		}
		addSearchHTML() {
			$('body').append(`
				<div class="search-overlay">
					<div class="search-overly__top">
						<div class="container">
							<i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
							<input class="search-term" placeholder="What are you looking for" id="search-term" type="text">
							<i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
						</div>
					</div>
					<div class="container">
						<div id="search-overlay__results">

						</div>
					</div>
				</div>
			`)
		}
	}


	var search = new Search();
})(jQuery)






