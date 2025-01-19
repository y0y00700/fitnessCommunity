var waveSurfers = {};
var waveformHeight = 50;
var barWidth = 2;
var currentPlayingId = null;
var lastStoppedId = null;
var keyword = '';
var cateCode = '';
var subcode = '';
var subsubcode = '';
var page = 1;

function togglePlay(soundId) {
	for ( var id in waveSurfers) {
		if (waveSurfers.hasOwnProperty(id) && id != soundId) {
			waveSurfers[id].pause();
			waveSurfers[id].seekTo(0); 
			var otherPlayBtn = document.getElementById('play-btn-' + id);
			if (otherPlayBtn) {
				otherPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
			}
			var otherWaveform = document.getElementById('waveform-' + id);
			var otherSoundItem = otherWaveform ? otherWaveform.closest('.sound-item') : null;

			if (otherSoundItem) {
				otherSoundItem.classList.remove('active');
				otherWaveform.style.display = 'none'; 
			}
		}
	}

	var playBtn = document.getElementById('play-btn-' + soundId);
	var wavesurfer = waveSurfers[soundId];
	var waveform = document.getElementById('waveform-' + soundId);
	if (!waveform) {
		console.error('waveform element not found for soundId:', soundId);
		return; 
	}
	var soundItem = waveform.closest('.sound-item');

	if (wavesurfer.isPlaying()) {
		wavesurfer.pause();
		if (playBtn) {
			playBtn.innerHTML = '<i class="fas fa-play"></i>';
		}
		currentPlayingId = null;
		lastStoppedId = soundId;

		if (soundItem) {
			soundItem.classList.add('active');
			waveform.style.display = 'block'; 
		}
	} else {
		wavesurfer.play();
		if (playBtn) {
			playBtn.innerHTML = '<i class="fas fa-pause"></i>';
		}
		currentPlayingId = soundId;
		lastStoppedId = null;

		if (soundItem) {
			soundItem.classList.add('active');
			waveform.style.display = 'block'; 
		}
	}


	wavesurfer.on('finish', function() {
		wavesurfer.seekTo(0); 
		if (playBtn) {
			playBtn.innerHTML = '<i class="fas fa-play"></i>'; 
		}
	});
}

function downloadAudio(filename, soundId, cateCode) {

	$.ajax({
		type : "POST",
		url : '/checkAndIncreaseDownloadCount',
		data : {
			soundId : soundId
		},
		success : function(response) {
			
			if (response.trim() === "success") {

				var link = document.createElement('a');
				link.href = '/display2?fileName=' + filename + '&codeCate='
						+ cateCode;
				link.download = filename.split('/').pop();
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} else if (response.trim() === "fail") {
				showAdModal();
			}
		},
		error : function(error) {
			console.error("다운로드 가능 여부 확인 중 오류 발생:", error);
		}
	});
}

function showResetButton() {
	document.getElementById('resetButton').style.display = 'block';
}

function showAdModal() {
	var adModal = document.getElementById('adModal');
	var closeBtn = document.getElementsByClassName('close')[0];

	adModal.style.display = "block";


	document.getElementById('adImage').onclick = function() {

		$.ajax({
			type : "POST",
			url : '/resetDownloadCount',
			success : function(response) {
				window.open("https://link.coupang.com/a/bSkQRW", "_blank");
				alert("다운로드 한도가 초기화 되었습니다. 다시 다운로드 하세요.");
				adModal.style.display = "none";
			},
			error : function(error) {
				console.error("다운로드 한도 초기화 에러 발생:", error);
			}
		});
	};

	closeBtn.onclick = function() {
		adModal.style.display = "none";
	};

	window.onclick = function(event) {
		if (event.target == adModal) {
			adModal.style.display = "none";
		}
	};
}

$(document)
		.ready(
				function() {

				
					var urlParams = new URLSearchParams(window.location.search);
					cateCode = urlParams.get('cateCode') || '';
					subcode = urlParams.get('subcode') || '';
					subsubcode = urlParams.get('subsubcode') || '';
					keyword = urlParams.get('keyword') || '';
					page = urlParams.get('page') || 1;
					
					 if (cateCode) {
	
					        getCateNameAndDisplay(cateCode);
					    } else {
					        $('#memotext').html('카테고리가 선택되지 않았습니다.');
					    }

					    $('#sidebar .nav-link').on('click', function (event) {
					        event.preventDefault();


					        var selectedCateCode = $(this).data('catecode');
					        var newUrl = '/main?cateCode=' + selectedCateCode + '&page=1';
					        
					       
					        window.location.href = newUrl;
					        
					        var mainCode = selectedCateCode.substring(0, 2); 
					        var page = 1; 
					        
					        $.ajax({
					            url: '/getmainSoundList',
					            method: 'GET',
					            data: {
					                cateCode: mainCode,
					                page: page
					            },
					            success: function(response) {
					                
					                if (response && response.soundList) {
					                    renderSoundList(response.soundList); 
					                    renderPagination(mainCode, response.totalPages, response.currentPage, 'main'); // 페이지네이션 추가
					                    
					                    $('#default-image').hide();
					                } else {
					                    $('#sound-list-container').html('<p>사운드 리스트를 불러오지 못했습니다.</p>');
					                }
					            },
					            error: function(xhr, status, error) {
					                console.error('Sound 리스트 요청 중 오류 발생:', error);
					                $('#sound-list-container').html('<p>사운드 리스트를 불러오는 데 실패했습니다.</p>');
					            }
					        });
					    });
					
					
					
					if (cateCode) {
						var codeToUse = cateCode; 

					    if (subsubcode) {
					        codeToUse = subsubcode;  
					    } else if (subcode) {
					        codeToUse = subcode;  
					    }
						
						
					    $.ajax({
					        url: '/getMetaTag2',
					        method: 'GET',
					        data: {
					            cateCode: codeToUse
					        },
					        success: function(metaData2) {
					           
					            var titleTag = document.querySelector('title');
					            if (titleTag) {
					                titleTag.textContent = metaData2; 
					            } else {
					                var newTitleTag = document.createElement('title');
					                newTitleTag.textContent = metaData2;
					                document.head.appendChild(newTitleTag);
					            }

					            // meta[name="title"], og:title, twitter:title 모두 <title>과 동일하게 업데이트
					            var metaOgTitleTag = document.querySelector('meta[name="title"]');
					            if (metaOgTitleTag) {
					                metaOgTitleTag.setAttribute('content', metaData2);
					            } else {
					                var newMetaOgTitleTag = document.createElement('meta');
					                newMetaOgTitleTag.setAttribute('name', 'title');
					                newMetaOgTitleTag.setAttribute('content', metaData2);
					                document.head.appendChild(newMetaOgTitleTag);
					            }

					            var ogTitleTag = document.querySelector('meta[property="og:title"]');
					            if (ogTitleTag) {
					                ogTitleTag.setAttribute('content', metaData2);
					            } else {
					                var newOgTitleTag = document.createElement('meta');
					                newOgTitleTag.setAttribute('property', 'og:title');
					                newOgTitleTag.setAttribute('content', metaData2);
					                document.head.appendChild(newOgTitleTag);
					            }

					            var twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
					            if (twitterTitleTag) {
					                twitterTitleTag.setAttribute('content', metaData2);
					            } else {
					                var newTwitterTitleTag = document.createElement('meta');
					                newTwitterTitleTag.setAttribute('name', 'twitter:title');
					                newTwitterTitleTag.setAttribute('content', metaData2);
					                document.head.appendChild(newTwitterTitleTag);
					            }

					        
					            var currentUrl = 'https://sounduck.com/main?cateCode=' + codeToUse + '&page=1';
					            var metaOgUrlTag = document.querySelector('meta[name="url"]');
					            if (metaOgUrlTag) {
					                metaOgUrlTag.setAttribute('content', currentUrl);
					            } else {
					                var newMetaOgUrlTag = document.createElement('meta');
					                newMetaOgUrlTag.setAttribute('name', 'url');
					                newMetaOgUrlTag.setAttribute('content', currentUrl);
					                document.head.appendChild(newMetaOgUrlTag);
					            }

					            var ogUrlTag = document.querySelector('meta[property="og:url"]');
					            if (ogUrlTag) {
					                ogUrlTag.setAttribute('content', currentUrl);
					            } else {
					                var newOgUrlTag = document.createElement('meta');
					                newOgUrlTag.setAttribute('property', 'og:url');
					                newOgUrlTag.setAttribute('content', currentUrl);
					                document.head.appendChild(newOgUrlTag);
					            }
					        },
					        error: function(xhr, status, error) {
					            console.error('메타 태그 가져오기 오류:', error);
					        }
					    });

					    $.ajax({
					        url: '/getMetaTag',
					        method: 'GET',
					        data: {
					            cateCode: codeToUse.substring(0, 2)
					        },
					        success: function(metaData) {
					           
					            var metaOgDescriptionTag = document.querySelector('meta[name="description"]');
					            if (metaOgDescriptionTag) {
					                metaOgDescriptionTag.setAttribute('content', metaData);
					            } else {
					                var newMetaOgDescriptionTag = document.createElement('meta');
					                newMetaOgDescriptionTag.setAttribute('name', 'description');
					                newMetaOgDescriptionTag.setAttribute('content', metaData);
					                document.head.appendChild(newMetaOgDescriptionTag);
					            }

					            var ogDescriptionTag = document.querySelector('meta[property="og:description"]');
					            if (ogDescriptionTag) {
					                ogDescriptionTag.setAttribute('content', metaData);
					            } else {
					                var newOgDescriptionTag = document.createElement('meta');
					                newOgDescriptionTag.setAttribute('property', 'og:description');
					                newOgDescriptionTag.setAttribute('content', metaData);
					                document.head.appendChild(newOgDescriptionTag);
					            }

					            var twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
					            if (twitterDescriptionTag) {
					                twitterDescriptionTag.setAttribute('content', metaData);
					            } else {
					                var newTwitterDescriptionTag = document.createElement('meta');
					                newTwitterDescriptionTag.setAttribute('name', 'twitter:description');
					                newTwitterDescriptionTag.setAttribute('content', metaData);
					                document.head.appendChild(newTwitterDescriptionTag);
					            }
					        },
					        error: function(xhr, status, error) {
					            console.error('메타 태그 가져오기 오류:', error);
					        }
					    });
					}

					updateUIFromURL();

					$('body')
							.prepend(
									'<button id="category-toggle-btn" class="category-toggle-btn">카테고리</button>');

					$('#category-toggle-btn').on('click', function() {
						$('#sidebar').slideToggle();
						window.scrollTo({
							top : 0,
							behavior : 'smooth'
						});
					});

					$(window).resize(function() {
						if ($(window).width() > 767.98) {
							$('#sidebar').show();
							$('#category-toggle-btn').hide();
						} else {
							$('#sidebar').hide();
							$('#category-toggle-btn').show();
						}
					}).resize();

					$('#inquiry-link')
							.on(
									'click',
									function(event) {
										event.preventDefault();
										window
												.open('/inquiry', '문의하기',
														'width=800,height=600,scrollbars=yes,resizable=yes');

									});

					$('#popular-sound-link').on('click', function(event) {
						event.preventDefault();
						refreshPage();
					});

					$('#sidebar .nav-link')
							.on(
									'click',
									function(event) {
										event.preventDefault();
										$('.search-result-text').remove();

										cateCode = $(this).data('catecode');
										subcode = '';
										subsubcode = '';
										keyword = '';
										page = 1;
										updateURL();
										$('#sidebar .nav-link').removeClass(
												'active');
										$(this).addClass('active');
										$('#sub-buttons-container').show();
										$('#sub-sub-buttons-container').show();
										$('#search-buttons_container').hide();
										window.scrollTo({
											top : 0,
											behavior : 'smooth'
										});

										$.ajax({
													url : '/getSubCategories',
													method : 'GET',
													data : {
														cateCode : cateCode
													},
													success : function(data) {
														var subButtonsHtml = '';
														for (var i = 0; i < data.length; i++) {
															subButtonsHtml += '<button class="btn-sub" data-subcode="'
																	+ data[i].cateCode
																	+ '">'
																	+ data[i].cateName
																	+ '</button>';
														}
														$('#memotext').show();
														$('#default-image')
																.show();
														$(
																'#sub-buttons-container')
																.html(
																		subButtonsHtml);
														$(
																'#sub-sub-buttons-container')
																.empty();
														$(
																'#sound-list-container')
																.empty();
														$(
																'#pagination-container')
																.empty().hide();

														$.ajax({
																	url : '/getMetaTag2',
																	method : 'GET',
																	data : {
																		cateCode : cateCode
																	},
																	success : function(
																			metaData2) {
																		
																		
																		
												                        var titleTag = document.querySelector('title');
												                        if (titleTag) {
												                            titleTag.textContent = metaData2;
												                        } else {
												                            var newTitleTag = document.createElement('title');
												                            newTitleTag.textContent = metaData2;
												                            document.head.appendChild(newTitleTag);
												                        }

												                        
												                        var metaOgTitleTag = document.querySelector('meta[name="title"]');
												                        if (metaOgTitleTag) {
												                            metaOgTitleTag.setAttribute('content', metaData2);
												                        } else {
												                            var newMetaOgTitleTag = document.createElement('meta');
												                            newMetaOgTitleTag.setAttribute('name', 'title');
												                            newMetaOgTitleTag.setAttribute('content', metaData2);
												                            document.head.appendChild(newMetaOgTitleTag);
												                        }

												                    
												                        var ogTitleTag = document.querySelector('meta[property="og:title"]');
												                        if (ogTitleTag) {
												                            ogTitleTag.setAttribute('content', metaData2);
												                        } else {
												                            var newOgTitleTag = document.createElement('meta');
												                            newOgTitleTag.setAttribute('property', 'og:title');
												                            newOgTitleTag.setAttribute('content', metaData2);
												                            document.head.appendChild(newOgTitleTag);
												                        }

												                        // name="twitter:title" 메타 태그 업데이트
												                        var twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
												                        if (twitterTitleTag) {
												                            twitterTitleTag.setAttribute('content', metaData2);
												                        } else {
												                            var newTwitterTitleTag = document.createElement('meta');
												                            newTwitterTitleTag.setAttribute('name', 'twitter:title');
												                            newTwitterTitleTag.setAttribute('content', metaData2);
												                            document.head.appendChild(newTwitterTitleTag);
												                        }

												                        var currentUrl = window.location.href;

												                       
												                        var metaOgUrlTag = document.querySelector('meta[name="url"]');
												                        if (metaOgUrlTag) {
												                            metaOgUrlTag.setAttribute('content', currentUrl);
												                        } else {
												                            var newMetaOgUrlTag = document.createElement('meta');
												                            newMetaOgUrlTag.setAttribute('name', 'url');
												                            newMetaOgUrlTag.setAttribute('content', currentUrl);
												                            document.head.appendChild(newMetaOgUrlTag);
												                        }

												                   
												                        var ogUrlTag = document.querySelector('meta[property="og:url"]');
												                        if (ogUrlTag) {
												                            ogUrlTag.setAttribute('content', currentUrl);
												                        } else {
												                            var newOgUrlTag = document.createElement('meta');
												                            newOgUrlTag.setAttribute('property', 'og:url');
												                            newOgUrlTag.setAttribute('content', currentUrl);
												                            document.head.appendChild(newOgUrlTag);
												                        }

												                      
												                        var twitterUrlTag = document.querySelector('meta[name="twitter:url"]');
												                        if (twitterUrlTag) {
												                            twitterUrlTag.setAttribute('content', currentUrl);
												                        } else {
												                            var newTwitterUrlTag = document.createElement('meta');
												                            newTwitterUrlTag.setAttribute('name', 'twitter:url');
												                            newTwitterUrlTag.setAttribute('content', currentUrl);
												                            document.head.appendChild(newTwitterUrlTag);
												                        }
												                    },
												                    error: function(xhr, status, error) {
												                        console.error('메타 태그 가져오기 오류:', error);
												                    }
												                });


														$.ajax({
																	url : '/getMetaTag',
																	method : 'GET',
																	data : {
																		cateCode : cateCode.substring(0,2)
																	},
																	success : function(
																			metaData) {

																
												                        var metaOgDescriptionTag = document.querySelector('meta[name="description"]');
												                        if (metaOgDescriptionTag) {
												                            metaOgDescriptionTag.setAttribute('content', metaData);
												                        } else {
												                            var newMetaOgDescriptionTag = document.createElement('meta');
												                            newMetaOgDescriptionTag.setAttribute('name', 'description');
												                            newMetaOgDescriptionTag.setAttribute('content', metaData);
												                            document.head.appendChild(newMetaOgDescriptionTag);
												                        }

												                      
												                        var ogDescriptionTag = document.querySelector('meta[property="og:description"]');
												                        if (ogDescriptionTag) {
												                            ogDescriptionTag.setAttribute('content', metaData);
												                        } else {
												                            var newOgDescriptionTag = document.createElement('meta');
												                            newOgDescriptionTag.setAttribute('property', 'og:description');
												                            newOgDescriptionTag.setAttribute('content', metaData);
												                            document.head.appendChild(newOgDescriptionTag);
												                        }

												                    
												                        var twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
												                        if (twitterDescriptionTag) {
												                            twitterDescriptionTag.setAttribute('content', metaData);
												                        } else {
												                            var newTwitterDescriptionTag = document.createElement('meta');
												                            newTwitterDescriptionTag.setAttribute('name', 'twitter:description');
												                            newTwitterDescriptionTag.setAttribute('content', metaData);
												                            document.head.appendChild(newTwitterDescriptionTag);
												                        }
												                    },
												                    error: function(xhr, status, error) {
												                        console.error('메타 태그 가져오기 오류:', error);
												                    }
												                });
												            },

													error : function(xhr,
															status, error) {
														console
																.error(
																		'하위 카테고리 가져오기 오류:',
																		error);
													}
												});

										if ($(window).width() <= 767.98) {
											$('#sidebar').slideToggle();
										}
									});

					$('#main-content').on('click', '.btn-sub', function() {
					    subcode = $(this).data('subcode');
					    subsubcode = '';
					    keyword = '';
					    page = 1;
					    updateURL();
					    
					    subcode= subcode.toString();
					    $('.btn-sub').removeClass('active');
					    $(this).addClass('active');
					    
					   
					    var partialCateCode = subcode.substring(0, 5);
				        var page = 1; 
				      
					    $.ajax({
					        url: '/getSubSubCategories',
					        method: 'GET',
					        data: {
					            subcode: subcode
					        },
					        success: function(data) {
					            var subSubButtonsHtml = '';
					            for (var i = 0; i < data.length; i++) {
					                subSubButtonsHtml += '<button class="btn-sub-sub" data-subsubcode="' + data[i].cateCode + '">' + data[i].cateName + '</button>';
					            }
					            $('#memotext').show();
					            $('#sub-sub-buttons-container').html(subSubButtonsHtml).show();
					            $('#sound-list-container').empty();
					            $('#pagination-container').show();

					         
					            $.ajax({
					                url: '/getMetaTag2',
					                method: 'GET',
					                data: {
					                    cateCode: subcode
					                },
					                success: function(metaData2) {
					                  
					                    var titleTag = document.querySelector('title');
					                    if (titleTag) {
					                        titleTag.textContent = metaData2;
					                    } else {
					                        var newTitleTag = document.createElement('title');
					                        newTitleTag.textContent = metaData2;
					                        document.head.appendChild(newTitleTag);
					                    }

					                    var metaOgTitleTag = document.querySelector('meta[name="title"]');
					                    if (metaOgTitleTag) {
					                        metaOgTitleTag.setAttribute('content', metaData2);
					                    } else {
					                        var newMetaOgTitleTag = document.createElement('meta');
					                        newMetaOgTitleTag.setAttribute('name', 'title');
					                        newMetaOgTitleTag.setAttribute('content', metaData2);
					                        document.head.appendChild(newMetaOgTitleTag);
					                    }

					               
					                    var ogTitleTag = document.querySelector('meta[property="og:title"]');
					                    if (ogTitleTag) {
					                        ogTitleTag.setAttribute('content', metaData2);
					                    } else {
					                        var newOgTitleTag = document.createElement('meta');
					                        newOgTitleTag.setAttribute('property', 'og:title');
					                        newOgTitleTag.setAttribute('content', metaData2);
					                        document.head.appendChild(newOgTitleTag);
					                    }

					                   
					                    var twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
					                    if (twitterTitleTag) {
					                        twitterTitleTag.setAttribute('content', metaData2);
					                    } else {
					                        var newTwitterTitleTag = document.createElement('meta');
					                        newTwitterTitleTag.setAttribute('name', 'twitter:title');
					                        newTwitterTitleTag.setAttribute('content', metaData2);
					                        document.head.appendChild(newTwitterTitleTag);
					                    }
					                },
					                error: function(xhr, status, error) {
					                    console.error('메타 태그 가져오기 오류:', error);
					                }
					            });
					        },
					        error: function(xhr, status, error) {
					            console.error('하위 하위 카테고리 가져오기 오류:', error);
					        }
					    });
					    
					
					    $.ajax({
					        url: '/getsubSoundList',
					        method: 'GET',
					        data: {
					            cateCode: partialCateCode, 
					            page: page
					        },
					        success: function (data) {
					            if (data && data.soundList) {
					                renderSoundList(data.soundList); 
					                renderPagination(partialCateCode, data.totalPages, data.currentPage, 'subcode'); // 페이지네이션 추가
					                $('#default-image').hide();
					            } else {
					                $('#sound-list-container').html('<p>사운드 리스트를 불러올 수 없습니다.</p>');
					            }
					        },
					        error: function (xhr, status, error) {
					            console.error('/getsubSoundList 호출 오류:', error);
					            $('#sound-list-container').html('<p>사운드 리스트를 가져오는 데 실패했습니다.</p>');
					        }
					    });
					});
					    
					    
				

					$('#main-content').on('click', '.btn-sub-sub', function() {
						subsubcode = $(this).data('subsubcode');
						page = 1;
						updateURL();
						$('.btn-sub-sub').removeClass('active');
						$(this).addClass('active');
						$('#pagination-container').show();
						loadSoundList(subsubcode, page);
						
						 $.ajax({
						        url: '/getMetaTag2',
						        method: 'GET',
						        data: {
						            cateCode: subsubcode
						        },
						        success: function(metaData2) {
				                    
				                    var titleTag = document.querySelector('title');
				                    if (titleTag) {
				                        titleTag.textContent = metaData2;
				                    } else {
				                        var newTitleTag = document.createElement('title');
				                        newTitleTag.textContent = metaData2;
				                        document.head.appendChild(newTitleTag);
				                    }

				                 
				                    var metaOgTitleTag = document.querySelector('meta[name="title"]');
				                    if (metaOgTitleTag) {
				                        metaOgTitleTag.setAttribute('content', metaData2);
				                    } else {
				                        var newMetaOgTitleTag = document.createElement('meta');
				                        newMetaOgTitleTag.setAttribute('name', 'title');
				                        newMetaOgTitleTag.setAttribute('content', metaData2);
				                        document.head.appendChild(newMetaOgTitleTag);
				                    }

				                    
				                    var ogTitleTag = document.querySelector('meta[property="og:title"]');
				                    if (ogTitleTag) {
				                        ogTitleTag.setAttribute('content', metaData2);
				                    } else {
				                        var newOgTitleTag = document.createElement('meta');
				                        newOgTitleTag.setAttribute('property', 'og:title');
				                        newOgTitleTag.setAttribute('content', metaData2);
				                        document.head.appendChild(newOgTitleTag);
				                    }

				                
				                    var twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
				                    if (twitterTitleTag) {
				                        twitterTitleTag.setAttribute('content', metaData2);
				                    } else {
				                        var newTwitterTitleTag = document.createElement('meta');
				                        newTwitterTitleTag.setAttribute('name', 'twitter:title');
				                        newTwitterTitleTag.setAttribute('content', metaData2);
				                        document.head.appendChild(newTwitterTitleTag);
				                    }
				                },
						        error: function(xhr, status, error) {
						            console.error('메타 태그 가져오기 오류:', error);
						        }
						    });
						});
				
									
					$('form').on('submit', function(event) {
						event.preventDefault();
						keyword = $('input[name="keyword"]').val();
						if (!keyword.trim()) {
							alert("검색어를 입력하세요");
							return;
						}
						cateCode = '';
						subcode = '';
						subsubcode = '';
						page = 1;
						updateURL();
						$('#pagination-container').show();
						loadSearchResults(keyword, page);
					});

					$('#main-content').on('click', '.btn-search', function() {
						var subsearchCode = $(this).data('subsearchcode');
						page = 1;
						updateURL();
						$('.btn-search').removeClass('active');
						$(this).addClass('active');
						$('#pagination-container').show();
						loadSubSearchResults(subsearchCode, keyword, page);
						
						// getMetaTag2 ajax 요청 추가
					    $.ajax({
					        url: '/getMetaTag2',
					        method: 'GET',
					        data: {
					            cateCode: subsearchCode
					        },
					        success: function(metaData2) {
			             
			                    var titleTag = document.querySelector('title');
			                    if (titleTag) {
			                        titleTag.textContent = metaData2;
			                    } else {
			                        var newTitleTag = document.createElement('title');
			                        newTitleTag.textContent = metaData2;
			                        document.head.appendChild(newTitleTag);
			                    }

			                  
			                    var metaOgTitleTag = document.querySelector('meta[name="title"]');
			                    if (metaOgTitleTag) {
			                        metaOgTitleTag.setAttribute('content', metaData2);
			                    } else {
			                        var newMetaOgTitleTag = document.createElement('meta');
			                        newMetaOgTitleTag.setAttribute('name', 'title');
			                        newMetaOgTitleTag.setAttribute('content', metaData2);
			                        document.head.appendChild(newMetaOgTitleTag);
			                    }

			                   
			                    var ogTitleTag = document.querySelector('meta[property="og:title"]');
			                    if (ogTitleTag) {
			                        ogTitleTag.setAttribute('content', metaData2);
			                    } else {
			                        var newOgTitleTag = document.createElement('meta');
			                        newOgTitleTag.setAttribute('property', 'og:title');
			                        newOgTitleTag.setAttribute('content', metaData2);
			                        document.head.appendChild(newOgTitleTag);
			                    }

			                   
			                    var twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
			                    if (twitterTitleTag) {
			                        twitterTitleTag.setAttribute('content', metaData2);
			                    } else {
			                        var newTwitterTitleTag = document.createElement('meta');
			                        newTwitterTitleTag.setAttribute('name', 'twitter:title');
			                        newTwitterTitleTag.setAttribute('content', metaData2);
			                        document.head.appendChild(newTwitterTitleTag);
			                    }
			                },
					        error: function(xhr, status, error) {
					            console.error('메타 태그 가져오기 오류:', error);
					        }
					    });
					});

					updateUIFromURL();

					function updateUIFromURL() {

						if (!cateCode && !subcode && !subsubcode && !keyword) {

							$('#sound-list-container').show();
						} else if (subsubcode) {

							loadSoundList(subsubcode, page);
						} else if (keyword) {

							loadSearchResults(keyword, page);
							
						} else if (subcode) {
					       
					        loadsubSoundList(subcode, page);
					    }
						else if (cateCode) {
					        
					        loadMainSoundList();
						} else {

							$('#sound-list-container').empty();
						}
						if (cateCode) {
							$(
									'#sidebar .nav-link[data-catecode="'
											+ cateCode + '"]').addClass(
									'active');
							$('#sub-buttons-container').show();
							$
									.ajax({
										url : '/getSubCategories',
										method : 'GET',
										data : {
											cateCode : cateCode
										},
										success : function(data) {
											var subButtonsHtml = '';
											for (var i = 0; i < data.length; i++) {
												subButtonsHtml += '<button class="btn-sub" data-subcode="'
														+ data[i].cateCode
														+ '">'
														+ data[i].cateName
														+ '</button>';
											}
											$('#sub-buttons-container').html(
													subButtonsHtml);
											if (subcode) {
												$(
														'#sub-buttons-container .btn-sub[data-subcode="'
																+ subcode
																+ '"]')
														.addClass('active');
												$('#sub-sub-buttons-container').show();
												$
														.ajax({
															url : '/getSubSubCategories',
															method : 'GET',
															data : {
																subcode : subcode
															},
															success : function(
																	data) {
																var subSubButtonsHtml = '';
																for (var i = 0; i < data.length; i++) {
																	subSubButtonsHtml += '<button class="btn-sub-sub" data-subsubcode="'
																			+ data[i].cateCode
																			+ '">'
																			+ data[i].cateName
																			+ '</button>';
																}
																$(
																		'#sub-sub-buttons-container')
																		.html(
																				subSubButtonsHtml);
																if (subsubcode) {
																	$(
																			'#sub-sub-buttons-container .btn-sub-sub[data-subsubcode="'
																					+ subsubcode
																					+ '"]')
																			.addClass(
																					'active');
																	loadSoundList(
																			subsubcode,
																			page);
																}
															},
															error : function(
																	xhr,
																	status,
																	error) {
																console
																		.error(
																				'하위 하위 카테고리 가져오기 오류:',
																				error);
															}
														});
											}
										},
										error : function(xhr, status, error) {
											console.error('하위 카테고리 가져오기 오류:',
													error);
										}
									});
						} else if (keyword) {
							loadSearchResults(keyword, page);
						}
					}

					function updateURL() {
						var newUrl = contextPath + '/main?';
						if (cateCode) {
							newUrl += 'cateCode=' + cateCode;
						}
						if (subcode) {
							newUrl += '&subcode=' + subcode;
						}
						if (subsubcode) {
							newUrl += '&subsubcode=' + subsubcode;
						}
						if (keyword) {
							newUrl += '&keyword=' + keyword;
						}
						newUrl += '&page=' + page;
						window.history.pushState({}, '', newUrl);
					}
					
					function loadMainSoundList() {
					    $.ajax({
					        url: '/getmainSoundList',
					        method: 'GET',
					        data: {
					            cateCode: cateCode.substring(0, 2), 
					            page: page
					        },
					        success: function(response) {
					            if (response && response.soundList) {
					                renderSoundList(response.soundList); 
					                renderPagination(cateCode, response.totalPages, response.currentPage, 'main'); // 페이지네이션 추가
					                $('#default-image').hide(); 
					            } else {
					                $('#sound-list-container').html('<p>사운드 리스트를 불러올 수 없습니다.</p>');
					            }
					        },
					        error: function(xhr, status, error) {
					            console.error('메인 사운드 리스트 가져오기 오류:', error);
					            $('#sound-list-container').html('<p>사운드 리스트를 가져오는 데 실패했습니다.</p>');
					        }
					    });
				
					}
					
					function loadsubSoundList(cateCode, page) {
					    $.ajax({
					        url: '/getsubSoundList',
					        method: 'GET',
					        data: {
					            cateCode: cateCode.substring(0, 5), 
					            page: page 
					        },
					        success: function(response) {
					            if (response && response.soundList) {
					                renderSoundList(response.soundList);
					                renderPagination(cateCode, response.totalPages, response.currentPage, 'subcode');
					                $('#default-image').hide();
					            } else {
					                $('#sound-list-container').html('<p>사운드 리스트를 불러올 수 없습니다.</p>');
					            }
					        },
					        error: function(xhr, status, error) {
					            console.error('사운드 리스트 가져오기 오류:', error);
					            $('#sound-list-container').html('<p>사운드 리스트를 가져오는 데 실패했습니다.</p>');
					        }
					    });
				
					}
					
					function loadSoundList(subsubcode, page) {
						
						$.ajax({
							url : '/getSoundList',
							method : 'GET',
							data : {
								subsubcode : subsubcode,
								page : page
							},
							success : function(data) {
								renderSoundList(data.soundList);
								renderPagination(subsubcode, data.totalPages,
										data.currentPage, 'subsubcode');

							
								$('#default-image').hide();
							},
							error : function(xhr, status, error) {
								console.error('Sound 리스트 가져오기 오류:', error);
							}
						});
					}

					function loadSearchResults(keyword, page) {
						$
								.ajax({
									url : '/search',
									method : 'GET',
									data : {
										keyword : keyword,
										page : page
									},
									success : function(data) {
										$('#sub-buttons-container').hide();
										$('#sub-sub-buttons-container').hide();
										$('#memotext').hide();
										$('#default-image').hide();
										$('#search-buttons_container').show();

										$('.search-result-text').remove();

										if (data.soundList.length === 0) {

											$('#sound-list-container')
													.html(
															'<p class="text-center">"'
																	+ keyword
																	+ '"에 대한 검색결과가 없습니다.</p>');
											$('#pagination-container').hide();
											$('#search-buttons_container')
													.hide();

										} else {
											var searchResultText = '<p class="search-result-text">"'
													+ keyword
													+ '"로 검색한 결과입니다.</p>';
											$('#search-buttons_container')
													.before(searchResultText);
											renderSoundList(data.soundList);
											renderPagination(keyword,
													data.totalPages,
													data.currentPage, 'search');
											loadSubSearchButtons(keyword);
										}
									},
									error : function(xhr, status, error) {
										console.error('검색 결과 가져오기 오류:', error);
									}
								});
					}

					function loadSubSearchButtons(keyword) {
						$
								.ajax({
									url : '/getSubSubSearch',
									method : 'GET',
									data : {
										keyword : keyword
									},
									success : function(data) {
										var searchButtonsHtml = '';
										for (var i = 0; i < data.length; i++) {
											var isActive = data[i].cateCode === cateCode ? 'active'
													: '';
											searchButtonsHtml += '<button class="btn-search '
													+ isActive
													+ '" data-subsearchcode="'
													+ data[i].cateCode
													+ '">'
													+ data[i].cateName
													+ '('
													+ data[i].num
													+ ')</button>';
										}
										$('#search-buttons_container').html(
												searchButtonsHtml).show();
									},
									error : function(xhr, status, error) {
										console.error(
												'/getSubSearchSound 호출 오류:',
												error);
									}
								});

					}

					function loadSubSearchResults(cateCode, keyword, page) {
						$.ajax({
							url : '/getSubSearchSound',
							method : 'GET',
							data : {
								cateCode : cateCode,
								keyword : keyword,
								page : page
							},
							success : function(data) {
								renderSoundList(data.soundList);
								renderPagination(cateCode, data.totalPages,
										data.currentPage, 'subsearch');
							},
							error : function(xhr, status, error) {
								console.error('Sound 리스트 가져오기 오류:', error);
							}
						});
					}

					function renderSoundList(data) {
						
					    $('#loading-message').show();
					    $('#loading-percentage').text('0%'); 
					    $('#sound-list-container').hide(); 
					    $('#pagination-container').hide();

					    var soundListHtml = '';
					    for (var i = 0; i < data.length; i++) {
					        soundListHtml += '<div class="sound-item">' +
					            '<img src="/display?fileName=' + data[i].imageFilename + '&codeCate=' + data[i].cateCode + '" />' +
					            '<div class="sound-info">' +
					            '<h6>' + data[i].soundName + '</h6>' +
					            '<p>' + data[i].soundInfo + '</p>' +
					            '</div>' +
					            '<button class="play-btn" id="play-btn-' + data[i].soundId + '" onclick="togglePlay(' + data[i].soundId + ')">' +
					            '<i class="fas fa-play"></i>' +
					            '</button>' +
					            '<div class="sound-waveform" id="waveform-' + data[i].soundId + '"></div>' +
					            '<button class="download-btn" onclick="downloadAudio(\'' + data[i].soundFilename + '\', ' + data[i].soundId + ', \'' + data[i].cateCode + '\')">' +
					            '다운로드</button></div>';
					    }

					    $('#sound-list-container').html(soundListHtml);

					   
					    var waveformsLoaded = 0;
					    var totalWaveforms = data.length;

					    for (var i = 0; i < data.length; i++) {
					        var soundId = data[i].soundId;
					        var wavesurfer = WaveSurfer.create({
					            container: '#waveform-' + soundId,
					            waveColor: 'lightgray',
					            progressColor: 'gray',
					            height: 50,
					            barWidth: 2
					        });

					        wavesurfer.load('/display2?fileName=' + data[i].soundFilename + '&codeCate=' + data[i].cateCode);
					        waveSurfers[soundId] = wavesurfer;

					       
					        wavesurfer.on('ready', function () {
					            waveformsLoaded++;

					            
					            var loadingPercentage = Math.round((waveformsLoaded / totalWaveforms) * 100);
					            $('#loading-percentage').text(loadingPercentage + '%'); 

					            
					            if (waveformsLoaded === totalWaveforms) {
					                $('#loading-message').hide(); 
					                $('#sound-list-container').show();  
					                $('#pagination-container').show(); 
					            }
					        });

					       
					        wavesurfer.on('error', function () {
					            waveformsLoaded++;

					          
					            var loadingPercentage = Math.round((waveformsLoaded / totalWaveforms) * 100);
					            $('#loading-percentage').text(loadingPercentage + '%'); // 퍼센트 업데이트

					            
					            if (waveformsLoaded === totalWaveforms) {
					                $('#loading-message').hide();  
					                $('#sound-list-container').show();  
					                $('#pagination-container').show(); 
					            }
					        });
					    }
					}
					
					
					function getCateNameAndDisplay(cateCode) {
						  $.ajax({
						        url: '/getCategoryName', 
						        method: 'GET',
						        data: { cateCode: cateCode },
						        success: function (cateName) {
						            if (cateName) {
						                // 카테고리 이름과 새로고침 아이콘 추가
						                $('#memotext').html(
						                    '카테고리 : "' + cateName + '" 효과음 <i id="refresh-icon" class="fas fa-sync-alt refresh-icon" title="새로고침"></i>'
						                );

						                // 새로고침 아이콘 클릭 이벤트 처리
						                $('#refresh-icon').on('click', function() {
						                    // 현재 URL의 쿼리스트링에서 cateCode와 page만 남기기
						                    var urlParams = new URLSearchParams(window.location.search);
						                    var cateCode = urlParams.get('cateCode') || '';
						                    var page = urlParams.get('page') || 1;

						                    if (cateCode) {
						                        // cateCode와 page만 포함된 새로운 URL 생성
						                        var newUrl = window.location.origin + window.location.pathname + '?cateCode=' + cateCode + '&page=' + page;
						                        // 페이지 새로고침
						                        window.location.href = newUrl;
						                    } else {
						                        alert('cateCode가 없습니다. 새로고침할 수 없습니다.');
						                    }
						                });
						            } else {
						                $('#memotext').html('카테고리를 찾을 수 없습니다.');
						            }
						        },
						        error: function (xhr, status, error) {
						            console.error('카테고리 이름을 가져오는 중 오류 발생:', error);
						            $('#memotext').html('카테고리를 불러오는 데 실패했습니다.');
						        }
						    });
						}

				
					function updateURLWithCateCode(cateCode) {
					    var newUrl = window.location.origin + window.location.pathname + '?cateCode=' + cateCode;
					    window.history.pushState({ path: newUrl }, '', newUrl);
					    
					}
					
					
					
					function renderPagination(identifier, totalPages,
							currentPage, type) {
						var paginationHtml = '';
						var maxPagesToShow = 5;
						var startPage = Math.floor((currentPage - 1)
								/ maxPagesToShow)
								* maxPagesToShow + 1;
						var endPage = Math.min(startPage + maxPagesToShow - 1,
								totalPages);

						
						if (startPage > 1) {
							paginationHtml += '<button class="page-btn prev-btn" data-page="'
									+ (startPage - 1) + '">Prev</button>';
						}

						for (var i = startPage; i <= endPage; i++) {
							paginationHtml += '<button class="page-btn" data-page="'
									+ i + '">' + i + '</button>';
						}

						
						if (endPage < totalPages) {
							paginationHtml += '<button class="page-btn next-btn" data-page="'
									+ (endPage + 1) + '">Next</button>';
						}

						$('#pagination-container').html(paginationHtml);

						$('.page-btn').on(
								'click',
								function() {
									page = $(this).data('page');
									updateURL();
									 if (type === 'main') {

								            loadMainSoundList();
								        } 
									 else if (type === 'subcode') {
										 loadsubSoundList(identifier, page);
								        } 
									 else if (type === 'subsubcode') {
										loadSoundList(identifier, page);
									} else if (type === 'search') {
										loadSearchResults(identifier, page);
									} else if (type === 'subsearch') {
										loadSubSearchResults(identifier,
												keyword, page);
									}
								});

						$('.page-btn[data-page="' + currentPage + '"]')
								.addClass('active');
					}

					$(document).keydown(
							function(event) {
								if (event.code === 'Space') {
									event.preventDefault();
									if (currentPlayingId) {
										togglePlay(currentPlayingId);
									} else if (lastStoppedId) {
										togglePlay(lastStoppedId);
									} else {
										var firstSoundButton = $('.play-btn')
												.first();
										if (firstSoundButton.length) {
											var firstSoundId = firstSoundButton
													.attr('id').split('-')[2];
											togglePlay(firstSoundId);
										}
									}
								}
							});

				});
