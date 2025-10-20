interface LgdMapAdmin {
  ajaxUrl: string;
  nonce: string;
  validation: {
    required: string;
    invalidEmail: string;
    invalidUrl: string;
    invalidPhone: string;
    invalidCoordinates: string;
    latitudeRange: string;
    longitudeRange: string;
    nameMinLength: string;
    nameMaxLength: string;
    descriptionMaxLength: string;
  };
  messages: {
    saving: string;
    saved: string;
    deleted: string;
    error: string;
    confirmDelete: string;
  };
}

interface PointData {
  id?: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  legendName: string;
  legendSubName: string;
  phone: string;
  website: string;
  created_at?: string;
  updated_at?: string;
}

interface AjaxResponse {
  success: boolean;
  data: {
    message?: string;
    points?: PointData[];
    settings?: Record<string, unknown>;
  };
}

declare const lgdMapAdmin: LgdMapAdmin;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(function ($: any) {
  'use strict';

  $(document).ready(function () {
    initPointManagement();
    initSettingsManagement();
    initValidation();
  });

  function initPointManagement(): void {
    $('#lgd-add-point-form').on('submit', function (e: Event) {
      e.preventDefault();
      savePoint();
    });

    $(document).on('click', '.lgd-edit-point', function () {
      const pointId = $(this).data('point-id') as number;
      editPoint(pointId);
    });

    $(document).on('click', '.lgd-delete-point', function () {
      const pointId = $(this).data('point-id') as number;
      deletePoint(pointId);
    });
  }

  function initSettingsManagement(): void {
    $('#lgd-settings-form').on('submit', function (e: Event) {
      e.preventDefault();
      saveSettings();
    });
  }

  function initValidation(): void {
    $('.lgd-point-form input, .lgd-point-form textarea, .lgd-point-form select').on(
      'blur',
      function () {
        validateField($(this));
      }
    );

    $('.lgd-point-form input, .lgd-point-form textarea, .lgd-point-form select').on(
      'input',
      function () {
        clearFieldError($(this));
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function validateField($field: any): boolean {
    const value: string = $field.val().trim();
    const rules: string = $field.data('validate');
    const fieldName: string = $field.attr('name');
    let isValid: boolean = true;
    let errorMessage: string = '';

    if (!rules) return true;

    const ruleList: string[] = rules.split(',');

    for (const rule of ruleList) {
      const [ruleName, ruleValue] = rule.split(':');

      switch (ruleName) {
        case 'required':
          if (!value) {
            isValid = false;
            errorMessage = lgdMapAdmin.validation.required;
          }
          break;

        case 'minLength':
          if (value && value.length < parseInt(ruleValue)) {
            isValid = false;
            if (fieldName === 'name') {
              errorMessage = lgdMapAdmin.validation.nameMinLength;
            } else {
              errorMessage = `Minimum length is ${ruleValue} characters`;
            }
          }
          break;

        case 'maxLength':
          if (value && value.length > parseInt(ruleValue)) {
            isValid = false;
            if (fieldName === 'name') {
              errorMessage = lgdMapAdmin.validation.nameMaxLength;
            } else if (fieldName === 'description') {
              errorMessage = lgdMapAdmin.validation.descriptionMaxLength;
            } else {
              errorMessage = `Maximum length is ${ruleValue} characters`;
            }
          }
          break;

        case 'latitude':
          if (
            value &&
            (isNaN(parseFloat(value)) || parseFloat(value) < -90 || parseFloat(value) > 90)
          ) {
            isValid = false;
            errorMessage = lgdMapAdmin.validation.latitudeRange;
          }
          break;

        case 'longitude':
          if (
            value &&
            (isNaN(parseFloat(value)) || parseFloat(value) < -180 || parseFloat(value) > 180)
          ) {
            isValid = false;
            errorMessage = lgdMapAdmin.validation.longitudeRange;
          }
          break;

        case 'url':
          if (value && !isValidUrl(value)) {
            isValid = false;
            errorMessage = lgdMapAdmin.validation.invalidUrl;
          }
          break;

        case 'phone':
          if (value && !isValidPhone(value)) {
            isValid = false;
            errorMessage = lgdMapAdmin.validation.invalidPhone;
          }
          break;
      }

      if (!isValid) break;
    }

    if (isValid) {
      clearFieldError($field);
    } else {
      showFieldError($field, errorMessage);
    }

    return isValid;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function showFieldError($field: any, message: string): void {
    $field.addClass('is-danger');
    $field.siblings('.help').text(message).show();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function clearFieldError($field: any): void {
    $field.removeClass('is-danger');
    $field.siblings('.help').text('').hide();
  }

  /**
   * Validate entire form
   */
  function validateForm(): boolean {
    let isValid: boolean = true;

    $('.lgd-point-form input, .lgd-point-form textarea, .lgd-point-form select').each(function () {
      if (!validateField($(this))) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate URL
   */
  function isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate phone number
   */
  function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Save point
   */
  function savePoint(): void {
    // Validate form first
    if (!validateForm()) {
      showNotice('Please fix the validation errors before saving.', 'error');
      return;
    }

    const form = $('#lgd-add-point-form');
    const formData = new FormData(form[0] as HTMLFormElement);
    const pointData: PointData = {} as PointData;

    for (const [key, value] of formData.entries()) {
      (pointData as Record<string, unknown>)[key] = value;
    }

    // Show loading
    const submitBtn = $('#submit-btn');
    const submitText = $('#submit-text');
    const originalText = submitText.text();
    submitText.text(lgdMapAdmin.messages.saving);
    submitBtn.prop('disabled', true).addClass('is-loading');

    // AJAX request
    $.ajax({
      url: lgdMapAdmin.ajaxUrl,
      type: 'POST',
      data: {
        action: 'lgd_map_save_point',
        point: pointData,
        nonce: lgdMapAdmin.nonce,
      },
      success: function (response: AjaxResponse) {
        if (response.success) {
          showNotice(lgdMapAdmin.messages.saved, 'success');
          resetForm();
          setTimeout(() => location.reload(), 1000); // Reload to show new point
        } else {
          showNotice('Failed to save point: ' + response.data.message, 'error');
        }
      },
      error: function () {
        showNotice(lgdMapAdmin.messages.error, 'error');
      },
      complete: function () {
        submitText.text(originalText);
        submitBtn.prop('disabled', false).removeClass('is-loading');
      },
    });
  }

  /**
   * Edit point
   */
  function editPoint(pointId: number): void {
    // Get point data
    $.ajax({
      url: lgdMapAdmin.ajaxUrl,
      type: 'POST',
      data: {
        action: 'lgd_map_get_data',
        nonce: lgdMapAdmin.nonce,
      },
      success: function (response: AjaxResponse) {
        if (response.success && response.data.points) {
          const points: PointData[] = response.data.points;
          const point = points.find(p => p.id === pointId);

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
            $('#form-title').text('Edit Point');
            $('#submit-text').text('Update Point');

            // Scroll to form
            $('html, body').animate(
              {
                scrollTop: $('.lgd-add-point-form').offset()!.top - 100,
              },
              500
            );
          }
        }
      },
    });
  }

  /**
   * Delete point
   */
  function deletePoint(pointId: number): void {
    if (!confirm(lgdMapAdmin.messages.confirmDelete)) {
      return;
    }

    $.ajax({
      url: lgdMapAdmin.ajaxUrl,
      type: 'POST',
      data: {
        action: 'lgd_map_delete_point',
        point_id: pointId,
        nonce: lgdMapAdmin.nonce,
      },
      success: function (response: AjaxResponse) {
        if (response.success) {
          showNotice(lgdMapAdmin.messages.deleted, 'success');
          location.reload(); // Reload to update list
        } else {
          showNotice('Failed to delete point: ' + response.data.message, 'error');
        }
      },
      error: function () {
        showNotice(lgdMapAdmin.messages.error, 'error');
      },
    });
  }

  /**
   * Save settings
   */
  function saveSettings(): void {
    const form = $('#lgd-settings-form');
    const formData = new FormData(form[0] as HTMLFormElement);
    const settings: Record<string, unknown> = {};

    // Convert FormData to nested object
    for (const [key, value] of formData.entries()) {
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
    const originalText = submitBtn.val() as string;
    submitBtn.val(lgdMapAdmin.messages.saving).prop('disabled', true);

    // AJAX request
    $.ajax({
      url: lgdMapAdmin.ajaxUrl,
      type: 'POST',
      data: {
        action: 'lgd_map_save_settings',
        settings: settings,
        nonce: lgdMapAdmin.nonce,
      },
      success: function (response: AjaxResponse) {
        if (response.success) {
          showNotice('Settings saved successfully!', 'success');
        } else {
          showNotice('Failed to save settings: ' + response.data.message, 'error');
        }
      },
      error: function () {
        showNotice(lgdMapAdmin.messages.error, 'error');
      },
      complete: function () {
        submitBtn.val(originalText).prop('disabled', false);
      },
    });
  }

  /**
   * Show admin notice
   */
  function showNotice(message: string, type: 'success' | 'error'): void {
    const noticeClass = type === 'success' ? 'notice-success' : 'notice-error';
    const notice = $(`<div class="notice ${noticeClass} is-dismissible"><p>${message}</p></div>`);

    $('.wrap h1').after(notice);

    // Auto-dismiss after 5 seconds
    setTimeout(function () {
      notice.fadeOut();
    }, 5000);
  }

  /**
   * Reset form to add new point
   */
  function resetForm(): void {
    $('#lgd-add-point-form')[0].reset();
    $('#point_id').remove();
    $('#form-title').text('Add New Point');
    $('#submit-text').text('Add Point');

    // Clear all validation errors
    $('.lgd-point-form input, .lgd-point-form textarea, .lgd-point-form select').each(function () {
      clearFieldError($(this));
    });
  }

  // Add reset button functionality
  $(document).on('click', '.lgd-reset-form', function () {
    resetForm();
  });

  // eslint-disable-next-line no-undef
})(jQuery);
