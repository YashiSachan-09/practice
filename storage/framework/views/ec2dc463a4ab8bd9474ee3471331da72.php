<?php $__env->startSection('content'); ?>
    <div class="flex min-h-screen flex-col justify-center px-4 py-14 sm:px-6">
        <div class="mx-auto w-full max-w-md">
            <p class="font-display text-center text-2xl tracking-tight text-gradient-gold sm:text-3xl">A7 ANAYARAA</p>
            <p class="mt-2 text-center text-xs uppercase tracking-[0.45em] text-gallery-amber/70">Administrative workspace</p>

            <?php if($errors->any()): ?>
                <div class="mt-8 rounded-2xl border border-gallery-ruby/40 bg-gallery-ruby/20 px-5 py-4 text-sm text-red-100">
                    <?php echo e($errors->first()); ?>

                </div>
            <?php endif; ?>

            <form action="<?php echo e(route('admin.login.attempt')); ?>" method="post" class="mt-12 space-y-6 rounded-3xl card-glass p-8 sm:p-10">
                <?php echo csrf_field(); ?>
                <div>
                    <label for="email" class="block text-xs font-semibold uppercase tracking-[0.25em] text-gallery-amber/80">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value="<?php echo e(old('email')); ?>"
                        autocomplete="username"
                        required
                        autofocus
                        class="mt-3 w-full rounded-xl border border-white/10 bg-gallery-void/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gallery-sand/40 focus:border-gallery-amber/55"
                        placeholder="admin@a7anayaraa.gallery"
                    />
                </div>
                <div>
                    <label for="password" class="block text-xs font-semibold uppercase tracking-[0.25em] text-gallery-amber/80">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        autocomplete="current-password"
                        required
                        class="mt-3 w-full rounded-xl border border-white/10 bg-gallery-void/60 px-4 py-3 text-sm text-white outline-none focus:border-gallery-amber/55"
                    />
                </div>
                <label class="flex cursor-pointer items-center gap-3 text-xs text-gallery-sand/70">
                    <input type="checkbox" name="remember" value="1" <?php echo e(old('remember') ? 'checked' : ''); ?> class="size-4 rounded border-white/20 bg-gallery-void/60 accent-gallery-amber" />
                    Remember session on trusted devices
                </label>
                <button type="submit" class="btn-primary w-full justify-center rounded-xl py-4 text-[13px] font-semibold uppercase tracking-[0.25em]">
                    Sign in
                </button>
            </form>

            <p class="mt-10 text-center text-[11px] leading-relaxed text-gallery-sand/45">
                <a href="<?php echo e(route('home')); ?>" class="underline decoration-gallery-amber/40 underline-offset-4 hover:text-white">← Back to public site</a>
            </p>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin-login', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\anayra\anayra\resources\views/admin/login.blade.php ENDPATH**/ ?>