;(function( win, $ ) {

	var S = {
		selectors: {
			init: 'table[data-mode-switch]'
		},
		attributes: {
			excludeMode: 'data-mode-exclude'
		},
		classes: {
			main: 'ui-table-modeswitch',
			toolbar: 'ui-table-toolbar'
		},
		modes: [ 'reflow', 'swipe', 'columntoggle' ],
		i18n: {
			modes: [ 'Stack', 'Swipe', 'Toggle' ],
			columns: 'Col<span class="a11y-sm">umn</span>s'
		},
		init: function( table ) {
			var $table = $( table ),
				ignoreMode = $table.attr( S.attributes.excludeMode ),
				$toolbar = $table.prev( '.ui-table-bar' ),
				modeVal = '',
				$switcher = $( '<div>' ).addClass( S.classes.main + ' ' + S.classes.toolbar ).html(function() {
					var html = [ '<label>' + S.i18n.columns + ':' ],
						dataMode = $table.attr( 'data-mode' ),
						isSelected;

					html.push( '<span class="btn btn-small">&#160;<select>' );
					for( var j=0, k = S.modes.length; j<k; j++ ) {
						if( ignoreMode && ignoreMode.toLowerCase() === S.modes[ j ] ) {
							continue;
						}

						isSelected = dataMode === S.modes[ j ];

						if( isSelected ) {
							modeVal = S.modes[ j ];
						}

						html.push( '<option' +
							( isSelected ? ' selected' : '' ) +
							' value="' + S.modes[ j ] + '">' + S.i18n.modes[ j ] + '</option>' );
					}
					html.push( '</select></span></label>' );

					return html.join('');
				});

			var $otherToolbarItems = $toolbar.find( '.table-advance' ).eq( 0 );
			if( $otherToolbarItems.length ) {
				$switcher.insertBefore( $otherToolbarItems );
			} else {
				$switcher.appendTo( $toolbar );
			}

			$switcher.find( '.btn' ).btn();
			$switcher.find( 'select' ).bind( 'change', S.onModeChange );
		},
		onModeChange: function() {
			var $t = $( this ),
				$switcher = $t.closest( '.' + S.classes.main ),
				$table = $t.closest( '.ui-table-bar' ).nextUntil( $table ).eq( 0 ),
				val = $t.val();

			$switcher.remove();
			$table.table( 'destroy' );

			$table.attr( 'data-mode', val );
			$table.table();
		}
	};

	$( win.document ).on( "tablecreate", "table", function() {
		if( $( this ).is( S.selectors.init ) ) {
			S.init( this );
		}
	});

})( this, jQuery );