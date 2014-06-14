<?php include_once 'head.php'; ?>
	<script type="text/javascript">	
	function lee_json(){
		$.getJSON("<?php echo $root; ?>public/assets/levels/1.json", function(datos){
			var lang = '';
			$.each(datos.layers, function(i, name){
				lang += name.data;
			});
				$('p#1').html(lang);
		});

		$.getJSON("<?php echo $root; ?>public/assets/levels/2.json", function(datos){
			var lang = '';
			$.each(datos.layers, function(i, name){
				$('p#2').html(name.data);
			});
		});

		$.getJSON("<?php echo $root; ?>public/assets/levels/3.json", function(datos){
			var lang = '';
			$.each(datos.layers, function(i, name){
				$('p#3').html(name.data);
			});
		});
	}
	</script>
	<body onload="lee_json()">
		<p id="1"></p>
		<p id="2"></p>
		<p id="3"></p>
	</body>
<?php include_once 'footer.php'; ?>