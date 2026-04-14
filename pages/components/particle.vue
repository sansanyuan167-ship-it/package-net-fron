<template>
	<view class="container">
		<canvas canvas-id="particleCanvas" :style="{ width: screenWidth + 'px', height: screenHeight + 'px' }"></canvas>
	</view>
</template>

<script>
	export default {
		props: {
			particleCount: {
				type: Number,
				default: 50
			}, // 粒子数量
			particleSizeRange: {
				type: Array,
				default: () => [2, 8]
			}, // 粒子大小范围[min, max]
			particleColors: {
				type: Array,
				default: () => ['#FF5E3A', '#FF2A68', '#1D62F0']
			} // 粒子颜色数组
		},
		data() {
			return {
				screenWidth: 0,
				screenHeight: 0,
				particles: [],
				ctx: null
			};
		},
		mounted() {
			this.initCanvas();
			uni.onWindowResize(() => this.initCanvas());
		},
		beforeDestroy() {
			cancelAnimationFrame(this.animationFrame);
		},
		methods: {
			initCanvas() {
				const sysInfo = uni.getSystemInfoSync();
				this.screenWidth = sysInfo.windowWidth;
				this.screenHeight = sysInfo.windowHeight;

				this.ctx = uni.createCanvasContext('particleCanvas', this);
				this.generateParticles();
				this.animateParticles();
			},

			generateParticles() {
				this.particles = [];
				const [minSize, maxSize] = this.particleSizeRange;

				for (let i = 0; i < this.particleCount; i++) {
					this.particles.push({
						x: Math.random() * this.screenWidth,
						y: Math.random() * this.screenHeight,
						vx: (Math.random() - 0.5) * 2,
						vy: (Math.random() - 0.5) * 2,
						radius: minSize + Math.random() * (maxSize - minSize),
						color: this.particleColors[
							Math.floor(Math.random() * this.particleColors.length)
						]
					});
				}
			},

			animateParticles() {
				this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

				this.particles.forEach(p => {
					// 更新位置
					p.x += p.vx;
					p.y += p.vy;

					// 边界反弹
					if (p.x <= 0 || p.x >= this.screenWidth) p.vx *= -1;
					if (p.y <= 0 || p.y >= this.screenHeight) p.vy *= -1;

					// 绘制粒子
					this.ctx.beginPath();
					this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
					this.ctx.fillStyle = p.color;
					this.ctx.fill();
				});

				this.ctx.draw();
				this.animationFrame = requestAnimationFrame(this.animateParticles);
			}
		}
	};
</script>

<style scoped>
	.container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}
</style>