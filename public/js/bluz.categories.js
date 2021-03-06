/**
 *
 *
 * @author   Viacheslav Nogin
 * @created  11.09.12 10:30
 */
/*global define,require*/
define(['jquery', 'bluz', 'bluz.notify', 'bluz.ajax', 'vendor/jquery.mjs.nestedSortable'], function ($, bluz, notify) {
    "use strict";

    $(document).ready(function () {

        function sortableInit() {
            $('.sortable').nestedSortable({
                handle: 'div',
                items: 'li',
                toleranceElement: '> div'
            });

        }

        sortableInit();

        $('.select-tree select').on('change', function () {

            var self = this;
            $.ajax({
                url: '/categories/grid',
                data: {
                    id: $(self).val()
                },
                success: function (resp) {
                    $('.tree-wrapper').remove();
                    $('.tree-container').html($(resp).find('.tree-wrapper'));

                    sortableInit();
                }
            });

        });

        $('#save').on('click', function (e) {

            $('.sortable li').each(function (key, value) {
                $(this).attr('data-ordering', key);
            });


            var arraied = $('ol.sortable').nestedSortable('toArray', {startDepthCount: 0});

            $.ajax({
                url: 'categories/orderTree',
                type: 'post',
                data: {
                    tree: JSON.stringify(arraied),
                    treeParent: $('.tree-header').attr('data-parent-id')
                },
                success: function (responce) {
                    notify.addSuccess('Tree has been saved');
                }
            });
        })

        $('.tree-container').on('ajax.bluz.success', '.remove', function () {
            $(this).parent().parent().remove();
        });

        $('.tree-container').on('ajax.bluz.success', '.remove-root', function () {
            $('.root-category-list').find('[value=' + $('.root-category-list').val() + ']').remove();

            if ($('.root-category-list').children().length === 0) {
                $('.message-wrapper').children().remove();
                $('.message-wrapper').append('<h3 class="not-one-category"> There are no categories</h3>');
            }

            $('.root-category-list').trigger('change');
        });

        $('body').on('form.bluz.success', '.category-edit', function () {
            $.ajax({
                url: '/categories/grid',
                data: {
                    id: $('.select-tree select').val()
                },
                success: function (resp) {
                    $('.tree-wrapper').remove();
                    $('.tree-container').html($(resp).find('.tree-wrapper'));

                    sortableInit();
                }
            });
        });


        $('body').on('form.bluz.success', '.category-form', function () {
            $.ajax({
                url: '/categories/grid',
                data: {
                    id: $('.select-tree select').val()
                },
                success: function (resp) {
                    $('.root-category-list').children().remove();
                    $('.root-category-list').append($(resp).find('.root-category-list').children());

                    if ($('.root-category-list').children().length !== 0) {
                        $('.not-one-category').remove();
                    }

                    $('.root-category-list').trigger('change');
                    sortableInit();
                }
            });
        });

        $('body').on('blur', '#name', function () {
            var $alias = $("#alias");
            if ($alias.val() == "") {
                var title = $(this).val().translit();
                title = title.toLowerCase();
                title = title.replace(/[ :;]+/gi, "-");
                title = title.replace(/[-]+/gi, "-");
                title = title.replace(/[^a-z0-9.-]/gi, "");


                $alias.val(title);
            }
        });

        String.prototype.translit = (function () {
            var L = {
                        'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
                        'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'Yo', 'ё': 'yo', 'Ж': 'Zh', 'ж': 'zh',
                        'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
                        'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
                        'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
                        'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts',
                        'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'Ъ': '"', 'ъ': '"',
                        'Ы': 'Y', 'ы': 'y', 'Ь': "'", 'ь': "'", 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu',
                        'Я': 'Ya', 'я': 'ya'
                    },
                    r = '',
                    k;
            for (k in L) r += k;
            r = new RegExp('[' + r + ']', 'g');
            k = function (a) {
                return a in L ? L[a] : '';
            };
            return function () {
                return this.replace(r, k);
            };
        })();
    });

    return {};
});