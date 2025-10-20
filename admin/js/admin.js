/**
 * Admin JavaScript for LGD Map Plugin
 */

(function($) {
    'use strict';

    // Initialize when document is ready
    $(document).ready(function() {
        initPointManagement();
        initSettingsManagement();
    });

    /**
     * Initialize point management
     */
    function initPointManagement() {
        // Add new point form
        $('#lgd-add-point-form').on('submit', function(e) {
            e.preventDefault();
            savePoint();
        });

        // Edit point buttons
        $(document).on('click', '.lgd-edit-point', function() {
            const pointId = $(this).data('point-id');
            editPoint(pointId);
        });

        // Delete point buttons
        $(document).on('click', '.lgd-delete-point', function() {
            const pointId = $(this).data('point-id');
            deletePoint(pointId);
        });
    }

    /**
     * Initialize settings management
     */
    function initSettingsManagement() {
        // Settings form
        $('#lgd-settings-form').on('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    /**
     * Save point
     */
    function savePoint() {
        const form = $('#lgd-add-point-form');
        const formData = new FormData(form[0]);
        const pointData = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            pointData[key] = value;
        }

        // Show loading
        const submitBtn = form.find('input[type="submit"]');
        const originalText = submitBtn.val();
        submitBtn.val('Saving...').prop('disabled', true);

        // AJAX request
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lgd_map_save_point',
                point: pointData,
                nonce: $('#lgd_map_nonce').val()
            },
            success: function(response) {
                if (response.success) {
                    showNotice('Point saved successfully!', 'success');
                    form[0].reset();
                    location.reload(); // Reload to show new point
                } else {
                    showNotice('Failed to save point: ' + response.data.message, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while saving the point.', 'error');
            },
            complete: function() {
                submitBtn.val(originalText).prop('disabled', false);
            }
        });
    }

    /**
     * Edit point
     */
    function editPoint(pointId) {
        // Get point data
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lgd_map_get_data',
                nonce: $('#lgd_map_nonce').val()
            },
            success: function(response) {
                if (response.success) {
                    const points = response.data.points;
                    const point = points.find(p => p.id == pointId);
                    
                    if (point) {
                        // Fill form with point data
                        $('#point_name').val(point.name);
                        $('#point_description').val(point.description);
                        $('#point_latitude').val(point.latitude);
                        $('#point_longitude').val(point.longitude);
                        $('#point_category').val(point.category);
                        $('#point_legend_name').val(point.legendName);
                        $('#point_legend_sub_name').val(point.legendSubName);
                        $('#point_phone').val(point.phone);
                        $('#point_website').val(point.website);
                        
                        // Add hidden field for point ID
                        if (!$('#point_id').length) {
                            $('#lgd-add-point-form').append('<input type="hidden" id="point_id" name="id" />');
                        }
                        $('#point_id').val(point.id);
                        
                        // Change form title and button
                        $('.lgd-add-point-form h2').text('Edit Point');
                        $('#lgd-add-point-form input[type="submit"]').val('Update Point');
                        
                        // Scroll to form
                        $('html, body').animate({
                            scrollTop: $('.lgd-add-point-form').offset().top - 100
                        }, 500);
                    }
                }
            }
        });
    }

    /**
     * Delete point
     */
    function deletePoint(pointId) {
        if (!confirm('Are you sure you want to delete this point?')) {
            return;
        }

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lgd_map_delete_point',
                point_id: pointId,
                nonce: $('#lgd_map_nonce').val()
            },
            success: function(response) {
                if (response.success) {
                    showNotice('Point deleted successfully!', 'success');
                    location.reload(); // Reload to update list
                } else {
                    showNotice('Failed to delete point: ' + response.data.message, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while deleting the point.', 'error');
            }
        });
    }

    /**
     * Save settings
     */
    function saveSettings() {
        const form = $('#lgd-settings-form');
        const formData = new FormData(form[0]);
        const settings = {};

        // Convert FormData to nested object
        for (let [key, value] of formData.entries()) {
            const keys = key.split('[').map(k => k.replace(']', ''));
            let current = settings;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
        }

        // Show loading
        const submitBtn = form.find('input[type="submit"]');
        const originalText = submitBtn.val();
        submitBtn.val('Saving...').prop('disabled', true);

        // AJAX request
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'lgd_map_save_settings',
                settings: settings,
                nonce: $('#lgd_map_nonce').val()
            },
            success: function(response) {
                if (response.success) {
                    showNotice('Settings saved successfully!', 'success');
                } else {
                    showNotice('Failed to save settings: ' + response.data.message, 'error');
                }
            },
            error: function() {
                showNotice('An error occurred while saving settings.', 'error');
            },
            complete: function() {
                submitBtn.val(originalText).prop('disabled', false);
            }
        });
    }

    /**
     * Show admin notice
     */
    function showNotice(message, type) {
        const noticeClass = type === 'success' ? 'notice-success' : 'notice-error';
        const notice = $('<div class="notice ' + noticeClass + ' is-dismissible"><p>' + message + '</p></div>');
        
        $('.wrap h1').after(notice);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            notice.fadeOut();
        }, 5000);
    }

    /**
     * Reset form to add new point
     */
    function resetForm() {
        $('#lgd-add-point-form')[0].reset();
        $('#point_id').remove();
        $('.lgd-add-point-form h2').text('Add New Point');
        $('#lgd-add-point-form input[type="submit"]').val('Add Point');
    }

    // Add reset button functionality
    $(document).on('click', '.lgd-reset-form', function() {
        resetForm();
    });

})(jQuery);
