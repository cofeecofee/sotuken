$.fn.slide = function(option) {
    var defaults = {
        slider: 'slider-list',
        sliderItem: 'slider-item',
        dotsItem: 'slider-dots',
        arrowItem: 'slider-arrow',
        dots: 'true',
        arrows: 'true',
        throttleTime: 200
    };

    var option = $.extend({}, defaults, option);
    var $self = $(this);
    $self.children().addClass(option.slider, $self);
    var $ul = $('.' + option.slider, $self);
    $ul.children().addClass(option.sliderItem);
    var items = this.find('.' + option.sliderItem).length;
    var moveTo = function(amount, direction) {
        if (direction === 'next' && $('.' + option.sliderItem + '.active', $self).is(':last-child')) {
            return false;
        } else if (direction === 'prev' && $('.' + option.sliderItem + '.active', $self).is(':first-child')) {
            return false;
        }
        $ul.css('transform', 'translateX(-' + width * amount + 'px)');
        $ul.css("transition-timing-function", "step-start");
        if (direction === 'next') {
            $('.' + option.sliderItem + '.active', $self).removeClass('active').next().addClass('active');
            $('.' + option.dotsItem + ' button.active', $self).removeClass('active').parent().next().find('button').addClass('active');
        } else if (direction === 'prev') {
            $('.' + option.sliderItem + '.active', $self).removeClass('active').prev().addClass('active');
            $('.' + option.dotsItem + ' button.active', $self).removeClass('active').parent().prev().find('button').addClass('active');
        } else if (direction === 'none') {
            $('.' + option.sliderItem + '.active').removeClass('active').addClass('active');
        }
    }

    var arrowDisable = function() {
        if ($('.' + option.sliderItem + '.active', $self).is(':last-child')) {
            $('.' + option.arrowItem + '-prev button', $self).prop('disabled', false);
            $('.' + option.arrowItem + '-next button', $self).prop('disabled', true);
        } else if ($('.' + option.sliderItem + '.active', $self).is(':first-child')) {
            $('.' + option.arrowItem + '-next button', $self).prop('disabled', false);
            $('.' + option.arrowItem + '-prev button', $self).prop('disabled', true);
        } else {
            $('.' + option.arrowItem + '-prev button', $self).prop('disabled', false);
            $('.' + option.arrowItem + '-next button', $self).prop('disabled', false);
        }
    }
    var direction = '';
    var startX = 0;
    var swipe = function(action, event) {
        if (action === 'start') {
            if (event && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0].pageX) {
                startX = event.originalEvent.touches[0].pageX;
            } else if (event.pageX) {
                startX = event.pageX;
            }
        } else if (action === 'move') {
            if (event && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0].pageX) {
                var endX = event.originalEvent.touches[0].pageX;
            } else if (event.pageX) {
                var endX = event.pageX;
            }
            var diffX = Math.round(startX - endX);
            $self.data('diffX', diffX);
            var absX = Math.abs(diffX);
            if (diffX > 0) {
                direction = 'next';
                $self.data('direction', diffX);
            } else if (diffX < 0) {
                direction = 'prev';
            }
        }
    }
    var swipeEnd = function() {
        if (direction == 'prev') {
            var amountItem = $ul.find('.active').attr('data-index');
            var amount = parseInt(amountItem) - 1;
            moveTo(amount, 'prev');
            arrowDisable();
        } else if (direction === 'next') {
            var amountItem = $ul.find('.active').attr('data-index');
            var amount = parseInt(amountItem) + 1;
            moveTo(amount, 'next');
            arrowDisable();
        }
    }

    // データ属性で何番目か取得する
    $('.' + option.sliderItem, $self).each(function(i) {
        $(this).attr('data-index', i);
    });

    // 幅の取得
    var width = $ul.children().width();
    var itemsWidth = items * width;
    var amount = 1;
    var amountItem = 0;

    $('.' + option.sliderItem, $self).width(width);
    $('.' + option.slider, $self).width(itemsWidth);

    $('.' + option.sliderItem + ':first-child', $self).addClass('active');
    next = function() {
        $('.' + option.arrowItem + '-prev button', $self).prop('disabled', false);
        amountItem = $ul.find('.active').attr('data-index');
        amount++;
        var current_page_bar = document.getElementsByClassName(option.dotsItem);
        current_page_bar[0].textContent = amount + "/" + a;
        var direction = 'next';
        moveTo(amount - 1, direction);
        arrowDisable();
    }
    prev = function() {
        $('.' + option.arrowItem + '-next button', $self).prop('disabled', false);
        amountItem = $ul.find('.active').attr('data-index');
        amount--;
        var current_page_bar = document.getElementsByClassName(option.dotsItem);
        current_page_bar[0].textContent = amount + "/" + a;
        var direction = 'prev';
        moveTo(amount - 1, direction);
        arrowDisable();
    }

    if (option.arrows === 'true') {
        $(this).append('<ul class="' + option.arrowItem + '"><li class="' + option.arrowItem + '-prev"><button type="button">前へ</button></li><li class="' + option.arrowItem + '-next"><button type="button">次へ</button></li></ul>');
        $('.' + option.arrowItem + '-prev button', $self).prop('disabled', true);

        $('.' + option.arrowItem + '-next button', $self).click(function() {
            next();
        });
        $('.' + option.arrowItem + '-prev button', $self).click(function() {
            prev();
        });
    }

    //ドットナビゲーション
    if (option.dots === 'true') {
        // データ属性で何番目か取得する
        var a = 0;
        $('.' + option.sliderItem, $self).each(function(i) {
            a++;
        });
        // ドットナビゲーションを追加する
        $(this).append('<ul class="' + option.dotsItem + '"></ul>');
        var current_page_bar = document.getElementsByClassName(option.dotsItem);
        current_page_bar[0].textContent = amount + "/" + a;

    }

    var timer = false,
        afterTimer = false;
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
            clearTimeout(afterTimer);
        }
        timer = setTimeout(function() {
            $ul.css('transition', 'none');
            width = $self.width();
            itemsWidth = items * width;
            $('.' + option.sliderItem, $self).width(width);
            $('.' + option.slider, $self).width(itemsWidth);
            var amountItem = $ul.find('.active').attr('data-index');
            var amount = parseInt(amountItem);
            moveTo(amount, 'none');
        }, option.throttleTime);
        afterTimer = setTimeout(function() {
            $ul.css('transition', '');
        }, option.throttleTime + 1);
    });

    return (this);

};

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    console.log(files)
        // files is a FileList of File objects. List some properties.
    var ln = [10, 100, 1000, 10000, 100000, 1000000, 10000000];
    var position_block;

    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        var display_list = [];

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                var ul = document.createElement('ul');
                var result_list = e.target.result.split("\n");
                var result_list_for_edit = [];
                var status_dict = {};
                var position_num = [];
                var time_list = [];
                var tanzai_check = false;
                result_list.pop();
                for (var j = 0; result_list.length > j; j++) {
                    position_block = { "頭部": ["□", "□", "□"], "腰部": ["□", "□", "□"], "足部": ["□", "□", "□"] };

                    result_list_for_edit.push(result_list[j].split(","));
                    result_list_for_edit[j].shift();
                    result_list_for_edit[j].pop();
                    result_list_for_edit[j][0] += "年";
                    result_list_for_edit[j][1] += "月";
                    result_list_for_edit[j][2] += "日";
                    result_list_for_edit[j][3] += "時";
                    result_list_for_edit[j][4] += "分";
                    result_list_for_edit[j][5] += "秒";
                    time_list.push(result_list_for_edit[j].slice(0, 6).join(""));

                    position_num.push(result_list_for_edit[j][7]);

                    if (ln.indexOf(Number(position_num[j])) >= 0) {
                        position_num[j] = ("0000000000000000" + Number(position_num[j])).slice(-16);
                        tanzai_check = true;
                    } else {
                        position_num[j] = parseInt(position_num[j], 16);
                        position_num[j] = ("0000000000000000" + Number(position_num[j].toString(2))).slice(-16);
                    }

                    result_list_for_edit[j][6] = Number(result_list_for_edit[j][6]);

                    if (result_list_for_edit[j][6] == 1) {
                        status_dict[1] = "無人";
                    } else if (result_list_for_edit[j][6] == 2) {
                        status_dict[2] = "寝返り";
                    } else if (result_list_for_edit[j][6] == 3 && tanzai_check) {
                        status_dict[3] = "起床：端座位";
                    } else if (result_list_for_edit[j][6] == 3 && !tanzai_check) {
                        status_dict[3] = "起床";
                    } else {
                        status_dict[4] = "就寝";
                    }

                    tanzai_check = false;

                    if (position_num[j][7] == "1") {
                        position_block["足部"][2] = "■";
                    }
                    if (position_num[j][8] == "1") {
                        position_block["足部"][1] = "■";
                    }
                    if (position_num[j][9] == "1") {
                        position_block["足部"][0] = "■";
                    }
                    if (position_num[j][10] == "1") {
                        position_block["腰部"][2] = "■";
                    }
                    if (position_num[j][11] == "1") {
                        position_block["腰部"][1] = "■";
                    }
                    if (position_num[j][12] == "1") {
                        position_block["腰部"][0] = "■";
                    }
                    if (position_num[j][13] == "1") {
                        position_block["頭部"][2] = "■";
                    }
                    if (position_num[j][14] == "1") {
                        position_block["頭部"][1] = "■";
                    }
                    if (position_num[j][15] == "1") {
                        position_block["頭部"][0] = "■";
                    }
                    display_list[j] = "<li class=\"slider-item\" data-index=\"j\"><h6 class=\"img-responsive\">" +
                        "<div style=\"font-size:40px\">" + time_list[j] + "</div><br>" +
                        "<div style=\"font-size:50px\">" + status_dict[result_list_for_edit[j][6]] +
                        "</div><br><div style=\"font-size:90px\">" +
                        position_block["頭部"][0] + " " + position_block["頭部"][1] + " " + position_block["頭部"][2] + "<br>" +
                        position_block["腰部"][0] + " " + position_block["腰部"][1] + " " + position_block["腰部"][2] + "<br>" +
                        position_block["足部"][0] + " " + position_block["足部"][1] + " " + position_block["足部"][2] + "</font><br>" + "</li>";
                }
                ul.innerHTML = display_list.join('');

                document.getElementById('list').insertBefore(ul, null);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }
    $(function() {
        $('.js-slider').slide({
            slider: 'slider-list',
            sliderItem: 'slider-item',
            dotsItem: 'slider-dots',
            arrowItem: 'slider-arrow',
            dots: 'true',
            arrows: 'true',
            throttleTime: 200
        })
    });
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

document.onkeydown = function(event) {
    var keyCode = false;

    if (event) {
        if (event.keyCode) {
            keyCode = event.keyCode;
        } else if (event.which) {
            keyCode = event.which;
        }
    }

    var check_disabled_next_button = document.getElementsByClassName("slider-arrow-next");
    var check_disabled_prev_button = document.getElementsByClassName("slider-arrow-prev");
    if (keyCode == 39 && check_disabled_next_button[0].firstElementChild.attributes.length != 2) {
        next();
    } else if (keyCode == 37 && check_disabled_prev_button[0].firstElementChild.attributes.length != 2) {
        prev();
    }
};